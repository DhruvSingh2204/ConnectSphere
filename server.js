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

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your frontend URL
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "http://localhost:5173" // CORS for Express routes
}));

app.use(express.json())

connectDB();

app.use('/auth' , require('./routes/auth'))

app.use('/post' , require('./routes/post'))

app.use('/search' , require('./routes/search'))

app.use('/load' , require('./routes/load'))

app.use('/req' , require('./routes/req'))

app.use('/fr' , require('./routes/fr'))

app.use('/like' , require('./routes/like'))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/chat' , require('./routes/chat'))

mongoose.connection.once('open' , () => {
    console.log('Connected to MongoDB')
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinChat', ({ correctUN, chatWith }) => {
        const room = [correctUN, chatWith].sort().join('-'); // Ensuring unique room for both users
        socket.join(room);
        console.log(`${correctUN} joined room: ${room}`);
    });

    socket.on('sendMessage', ({ correctUN, chatWith, message }) => {
        const room = [correctUN, chatWith].sort().join('-');
        io.to(room).emit('receiveMessage', { correctUN , chatWith , message, date: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(PORT , () => console.log(`Server Running on PORT ${PORT}`))