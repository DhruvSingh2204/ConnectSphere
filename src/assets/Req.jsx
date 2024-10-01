import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';

function Req({ correctUN }) {
    const [likeOpen, setLikeOpen] = useState(true)
    const [commentsOpen, setCommentsOpen] = useState(true)
    const [frreqopen, setFrreqopen] = useState(true)

    async function loadfr() {
        setFrreqopen(!frreqopen)

        if (frreqopen == false) {
            const mainDiv = document.getElementById('mainDiv');
            mainDiv.innerHTML = '';
            return;
        }

        const response = await axios.post('http://localhost:5000/fr/load', {
            correctUN
        });

        if(response.data.friendReq.length == 0) {
            const mainDiv = document.getElementById('mainDiv');
            mainDiv.innerHTML = 'No Friend Requests Currently';
            return;
        }

        const mainDiv = document.getElementById('mainDiv');
        mainDiv.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'friend-requests-table';

        const headerRow = document.createElement('tr');

        const header1 = document.createElement('th');
        header1.innerText = 'Friend Request';
        header1.className = 'table-header';

        const header2 = document.createElement('th');
        header2.innerText = 'Actions';
        header2.className = 'table-header';

        headerRow.appendChild(header1);
        headerRow.appendChild(header2);
        table.appendChild(headerRow);

        for (const fr of response.data.friendReq) {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.innerText = fr;
            nameCell.className = 'table-cell';

            const actionCell = document.createElement('td');
            actionCell.className = 'table-cell';

            const actionContainer = document.createElement('div');
            actionContainer.className = 'action-container';

            const acceptButton = document.createElement('button');
            acceptButton.innerText = 'Accept';
            acceptButton.className = 'action-btn accept-btn';

            const declineButton = document.createElement('button');
            declineButton.innerText = 'Decline';
            declineButton.className = 'action-btn decline-btn';

            actionContainer.appendChild(acceptButton);
            actionContainer.appendChild(declineButton);

            actionCell.appendChild(actionContainer);
            row.appendChild(nameCell);
            row.appendChild(actionCell);

            table.appendChild(row);

            acceptButton.onclick = async () => {
                console.log('accept button clicked');
                const responsea = await axios.post('http://localhost:5000/fr/accept', {
                    sender: correctUN,
                    recipient: fr
                });

                console.log(responsea);
            };

            declineButton.onclick = async () => {
                console.log('decline button clicked');
                const responsea = await axios.post('http://localhost:5000/fr/decline', {
                    sender: correctUN,
                    recipient: fr
                });

                console.log(responsea);
            };
        }

        mainDiv.appendChild(table);
    }

    async function loadlikes() {
        setLikeOpen(!likeOpen)

        if (likeOpen == false) {
            const mainDivLikes = document.getElementById('mainDivLikes');
            mainDivLikes.innerHTML = '';
            return;
        }

        const response = await axios.post('http://localhost:5000/like/loadlikes', {
            correctUN
        });

        const mainDivLikes = document.getElementById('mainDivLikes');
        mainDivLikes.innerHTML = '';

        const div = document.createElement('div');
        div.className = 'content-container';

        for (let i = response.data.length - 1;i>=0;i--) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'content-item';
            msgDiv.innerText = response.data[i];
            div.appendChild(msgDiv);
        }

        mainDivLikes.appendChild(div);
    }

    async function loadcomments() {
        setCommentsOpen(!commentsOpen)

        if (commentsOpen == false) {
            const mainDivComments = document.getElementById('mainDivComments');
            mainDivComments.innerHTML = '';
            return;
        }

        const response = await axios.post('http://localhost:5000/like/loadcomments', {
            correctUN
        });

        const mainDivComments = document.getElementById('mainDivComments');
        mainDivComments.innerHTML = '';

        const div = document.createElement('div');
        div.className = 'content-container';

        for (let i = response.data.length - 1;i>=0;i--) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'content-item';
            msgDiv.innerText = response.data[i];
            div.appendChild(msgDiv);
        }

        mainDivComments.appendChild(div);
    }

    return (
        <Container>
            <button onClick={loadfr}>Load Friend Requests</button>
            <div id='mainDiv'></div>
            <button onClick={loadlikes}>Load Likes</button>
            <div id='mainDivLikes'></div>
            <button onClick={loadcomments}>Load Comments</button>
            <div id='mainDivComments'></div>
        </Container>
    );
}

export default Req;

const Container = styled.div`
    margin: 20px auto;
    padding: 20px;
    max-width: 600px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    

    button {
        display: block;
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: none;
        background-color: #007bff;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;

        &:hover {
            background-color: #0056b3;
            transform: scale(1.02);
        }

        &:active {
            transform: scale(0.98);
        }
    }

    #mainDiv, #mainDivLikes, #mainDivComments {
        margin-top: 20px;
    }

    .friend-requests-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    .table-header {
        text-align: left;
        padding: 14px;
        background-color: #007bff;
        color: white;
        border-bottom: 2px solid #0056b3;
    }

    .table-cell {
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;
    }

    .action-container {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .action-btn {
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .accept-btn {
        background-color: #28a745;
    }

    .accept-btn:hover {
        background-color: #218838;
        transform: scale(1.05);
    }

    .accept-btn:active {
        transform: scale(0.95);
    }

    .decline-btn {
        background-color: #dc3545;
    }

    .decline-btn:hover {
        background-color: #c82333;
        transform: scale(1.05);
    }

    .decline-btn:active {
        transform: scale(0.95);
    }

    .content-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .content-item {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background-color: #f8f9fa;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        max-width: 200px;
        flex: 1 1 auto;
    }
`;