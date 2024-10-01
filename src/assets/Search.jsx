import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

function Search({ correctUN }) {
    async function search() {
        const response = await axios.post('http://localhost:5000/search/persons', {});
        const mainDiv = document.getElementById('mainDiv');
        mainDiv.innerText = '';

        console.log(response.data);

        for (const i of response.data) {
            if (i.username === correctUN) continue;

            const check = await axios.post('http://localhost:5000/req/check', {
                // sender: i.username ,
                // recipient: correctUN
                sender: correctUN ,
                recipient: i.username
            });

            if (check.data) {
                const div = document.createElement('div');
                div.className = 'result-card';

                const p = document.createElement('p');
                p.className = 'result-info';
                p.innerText = `Username: ${i.username} | Email: ${i.email}`;
                div.appendChild(p);

                const button = document.createElement('button');
                button.className = 'request-button';
                button.innerText = 'Already Friends';
                div.appendChild(button);
                mainDiv.appendChild(div);
            } else {
                const div = document.createElement('div');
                div.className = 'result-card';

                const p = document.createElement('p');
                p.className = 'result-info';
                p.innerText = `Username: ${i.username} | Email: ${i.email}`;
                div.appendChild(p);

                const button = document.createElement('button');
                button.className = 'request-button';
                button.innerText = 'Send Friend Request';
                button.onclick = async () => {
                    const btnres = await axios.post('http://localhost:5000/req/get', {
                        sender: correctUN,
                        recipient: i.username
                    });
                    console.log(btnres);
                    button.innerText = 'Requested';
                };

                div.appendChild(button);
                mainDiv.appendChild(div);
            }
        }
    }

    async function findFriend() {
        const friendToBeFound = document.getElementById('friend').value;
        if (!friendToBeFound) {
            return;
        }

        document.getElementById('mainDiv').innerText = ''

        const response = await axios.post('http://localhost:5000/search/person', { correctUN, friendToBeFound });

        if(response.data == 'Person Not Found') {
            const mainDiv = document.getElementById('mainDiv').innerText = '';
            const div = document.createElement('div');
            div.className = 'result-card';
            const p = document.createElement('p');
            p.className = 'result-info';
            p.innerText = `Username Not Found!`;
            div.appendChild(p);
            document.getElementById('mainDiv').appendChild(div);
            return;
        }

        const check = await axios.post('http://localhost:5000/req/check', {
            sender: correctUN,
            recipient: friendToBeFound
        });

        if (response.data.username == correctUN) {
            const mainDiv = document.getElementById('mainDiv').innerText = '';
            const div = document.createElement('div');
            div.className = 'result-card';
            const p = document.createElement('p');
            p.className = 'result-info';
            p.innerText = `Your ID`;
            div.appendChild(p);
            document.getElementById('mainDiv').appendChild(div);
        } else if (check.data) {
            const div = document.createElement('div');
            div.className = 'result-card';

            const p = document.createElement('p');
            p.className = 'result-info';
            p.innerText = `Username: ${friendToBeFound} | Email: ${response.data.email}`;
            div.appendChild(p);

            const button = document.createElement('button');
            button.className = 'request-button';
            button.innerText = 'Already Friends';
            div.appendChild(button);
            mainDiv.appendChild(div);
        } else {
            const div = document.createElement('div');
            div.className = 'result-card';

            const p = document.createElement('p');
            p.className = 'result-info';
            p.innerText = `Username: ${response.data.username} | Email: ${response.data.email}`;
            div.appendChild(p);

            const button = document.createElement('button');
            button.className = 'request-button';
            button.innerText = 'Send Friend Request';
            button.onclick = async () => {
                const btnres = await axios.post('http://localhost:5000/req/get', {
                    sender: correctUN,
                    recipient: friendToBeFound
                });
                console.log(btnres);
                button.innerText = 'Requested';
            };

            const mainDiv = document.getElementById('mainDiv');
            mainDiv.innerText = '';
            if (!(response.data == "Person Not Found")) {
                div.appendChild(button);
            }
            mainDiv.appendChild(div);
        }
    }

    return (
        <Container>
            <input placeholder='Search a Person' id='friend' />

            <button className='search-button' onClick={findFriend}>Search</button>
            <button className='search-button' onClick={search}>Show All</button>

            <div id='mainDiv'></div>
        </Container>
    );
}

export default Search;

const Container = styled.div`
    margin-left: 25vw;
    width: 50%;

    input {
        width: 100%;
        max-width: 300px;
        height: 5vh;
        padding: 0 15px;
        font-size: 1.15rem;
        border-radius: 20px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        outline: none;
    }

    .search-button {
        width: 100%;
        max-width: 150px;
        height: 40px;
        padding: 10px;
        border: none;
        border-radius: 20px;
        background-color: #0d47a1;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        margin: 5px 0;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

        &:hover {
            background-color: #003c8f;
        }

        &:active {
            background-color: #002d72;
        }
    }

    .result-card {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px 0;
        background-color: #e3f2fd;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .result-info {
        margin: 5px 0;
        font-family: Arial, sans-serif;
        color: #0d47a1;
    }

    .request-button {
        margin-top: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        background-color: #0d47a1;
        color: white;
        cursor: pointer;

        &:hover {
            background-color: #003c8f;
        }

        &:active {
            background-color: #002d72;
        }
    }
`;