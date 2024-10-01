import axios from 'axios';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat({ correctUN, chatWith }) {
    useEffect(() => {
        if (chatWith) {
            loadChat();
            socket.emit('joinChat', { correctUN, chatWith }); // Join the chat room on the server
        }
    }, [chatWith]);

    // Enable real-time chat by listening for new messages from the server
    useEffect(() => {
        socket.on('receiveMessage', ({correctUN , chatWith}) => {
            loadChat(); // Refresh chat when a new message is received
        });

        return () => {
            socket.off('receiveMessage'); // Clean up the listener on component unmount
        };
    }, [correctUN , chatWith]);

    async function loadChat() {
        console.log('in loadChat ->' , correctUN , chatWith);
        const response = await axios.post('http://localhost:5000/chat/loadChat', {
            correctUN, chatWith
        });

        let arr = [];

        for (let i = 0; i < response.data.chatRoom.msgf1to2.length; i++) {
            arr.push({
                type: '1to2',
                date: response.data.chatRoom.datef1to2[i],
                message: response.data.chatRoom.msgf1to2[i]
            });
        }

        for (let i = 0; i < response.data.chatRoom.msgf2to1.length; i++) {
            arr.push({
                type: '2to1',
                date: response.data.chatRoom.datef2to1[i],
                message: response.data.chatRoom.msgf2to1[i]
            });
        }
        arr.sort((a, b) => new Date(a.date) - new Date(b.date));

        console.log(arr);

        document.getElementById('nameDiv').innerText = chatWith;
        const msgDiv = document.getElementById('msgDiv');
        msgDiv.innerText = '';

        if (response.data.no == 1) {
            for (const temp of arr) {
                let name;

                const tempDiv = document.createElement('div');
                if (temp.type === '1to2') {
                    name = correctUN;
                    tempDiv.style.float = 'right';
                } else {
                    name = chatWith;
                    tempDiv.style.float = 'left';
                }

                const nameDiv = document.createElement('div');
                nameDiv.innerHTML = `<h4>${name}</h4><sub>${temp.date}</sub>`;
                tempDiv.appendChild(nameDiv);

                tempDiv.innerHTML += `${temp.message}`;
                tempDiv.className = 'messagereceived';
                tempDiv.style.width = '48%';
                msgDiv.appendChild(tempDiv);
            }
        }

        if (response.data.no == 2) {
            for (const temp of arr) {
                let name;

                const tempDiv = document.createElement('div');
                if (temp.type === '2to1') {
                    name = correctUN;
                    tempDiv.style.float = 'right';
                } else {
                    name = chatWith;
                    tempDiv.style.float = 'left';
                }

                const nameDiv = document.createElement('div');
                nameDiv.innerHTML = `<h4>${name}</h4><sub>${temp.date}</sub>`;
                tempDiv.appendChild(nameDiv);

                tempDiv.innerHTML += `${temp.message}`;
                tempDiv.className = 'messagereceived';
                tempDiv.style.width = '48%';
                msgDiv.appendChild(tempDiv);
            }
        }
    }

    async function sendMsg() {
        if (!correctUN || !chatWith) {
            return;
        }

        console.log('in sendMsg ->' , correctUN , chatWith);
        const message = document.getElementById('msg').value;

        if (message.trim() === '') {
            return;
        }

        await axios.post('http://localhost:5000/chat/sendmsg', {
            correctUN, chatWith, message
        });

        socket.emit('sendMessage', { correctUN, chatWith, message }); // Send message to the server through Socket.IO

        document.getElementById('msg').value = '';
    }

    return (
        <Container>
            <Header>
                <div id='nameDiv'></div>
            </Header>
            <MessagesContainer>
                <MessagesBox id='msgDiv'></MessagesBox>
            </MessagesContainer>
            {chatWith && (
                <InputContainer>
                    <input placeholder='Send a message' id='msg' />
                    <button onClick={sendMsg}>Send</button>
                </InputContainer>
            )}
        </Container>
    );
}

export default Chat;


const Container = styled.div`
    margin-left: 20vw;
    margin-bottom: 40px;
    width: 50vw;
    border: 2px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 88vh;

    .messagereceived , .messagesent {
        background-color: #fcfcff;
        padding: 10px;
        border-radius: 10px;
        margin-bottom: 10px;
        position: relative;
        max-width: 80%;
        word-wrap: break-word;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

const Header = styled.div`
    background-color: #4CAF50;
    color: white;
    padding: 15px;
    font-size: 1.2em;
    text-align: center;
    border-bottom: 2px solid #ddd;
`;

const MessagesContainer = styled.div`
    display: flex;
    flex: 1;
    overflow: auto;
    padding: 10px;
    border-bottom: 2px solid #ddd;
    background-image: url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg');
`;

const MessagesBox = styled.div`
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    border-radius: 5px;
    margin: 0 10px;
`;

const InputContainer = styled.div`
    display: flex;
    padding: 10px;
    border-top: 2px solid #ddd;
    background-color: #fff;

    input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-right: 10px;
        font-size: 1em;
    }

    button {
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        background-color: #4CAF50;
        color: white;
        font-size: 1em;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #45a049;
        }
    }
`;