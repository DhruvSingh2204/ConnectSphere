import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

function Search({ correctUN }) {
    async function search() {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'http://localhost:5000/search/persons',
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const mainDiv = document.getElementById('mainDiv');
        mainDiv.innerText = '';

        console.log(response.data);

        for (const i of response.data) {
            if (i.username === correctUN) continue;

            const check = await axios.post('http://localhost:5000/req/check', {
                // sender: i.username ,
                // recipient: correctUN
                sender: correctUN,
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

        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/search/person', { correctUN, friendToBeFound } ,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data == 'Person Not Found') {
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
    margin: 40px auto;
    max-width: 600px;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    input {
        width: 100%;
        height: 45px;
        padding: 0 15px;
        font-size: 1.1rem;
        border-radius: 25px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        outline: none;
        transition: border 0.3s, box-shadow 0.3s;

        &:focus {
            border-color: #1565c0;
            box-shadow: 0 0 5px rgba(21, 101, 192, 0.4);
        }
    }

    .search-button {
        width: 100%;
        max-width: 180px;
        height: 42px;
        padding: 10px 15px;
        border: none;
        border-radius: 25px;
        background: linear-gradient(135deg, #1565c0, #0d47a1);
        color: white;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        transition: background 0.3s, transform 0.1s;

        &:hover {
            background: linear-gradient(135deg, #0d47a1, #003c8f);
        }

        &:active {
            transform: scale(0.96);
        }
    }

    #mainDiv {
        width: 100%;
        margin-top: 20px;
    }

    .result-card {
        width: 100%;
        padding: 18px;
        margin: 12px 0;
        background: #e3f2fd;
        border-radius: 16px;
        box-shadow: 0 3px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
    }

    .result-info {
        color: #0d47a1;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .request-button {
        align-self: flex-start;
        padding: 8px 16px;
        border: none;
        border-radius: 25px;
        background: linear-gradient(135deg, #1565c0, #0d47a1);
        color: white;
        font-size: 0.95rem;
        cursor: pointer;
        transition: background 0.3s, transform 0.1s;

        &:hover {
            background: linear-gradient(135deg, #0d47a1, #003c8f);
        }

        &:active {
            transform: scale(0.95);
        }
    }
`;