require('dotenv').config()
const express = require('express')
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const authRoute = require('./routes/auth')
const bcrypt = require('bcryptjs');
const cors = require('cors')
const path = require('path');
const server = http.createServer(app);
const jwt = require('jsonwebtoken');

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json())

connectDB();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('token not found');
        return res.status(403).send('Token is required');
    }

    console.log('token is ->' , token)

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('invalid token' , error)
        return res.status(401).send('Invalid Token');
    }
};

app.use('/auth', require('./routes/auth'))

app.use('/post', require('./routes/post'))

app.use('/search', verifyToken, require('./routes/search'))

app.use('/load', require('./routes/load'))

app.use('/req', require('./routes/req'))

app.use('/fr', require('./routes/fr'))

app.use('/like', require('./routes/like'))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/chat', verifyToken, require('./routes/chat'))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinChat', ({ correctUN, chatWith }) => {
        const room = [correctUN, chatWith].sort().join('-');
        socket.join(room);
        console.log(`${correctUN} joined room: ${room}`);
    });

    socket.on('sendMessage', ({ correctUN, chatWith, message }) => {
        const room = [correctUN, chatWith].sort().join('-');
        io.to(room).emit('receiveMessage', { correctUN, chatWith, message, date: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))