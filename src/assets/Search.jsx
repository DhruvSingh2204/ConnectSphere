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
    margin-left: 25vw;
    width: 50%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Use a more modern font */

    input {
        width: 100%;
        max-width: 300px;
        height: 5vh;
        padding: 0 15px;
        font-size: 1.15rem;
        border-radius: 25px; /* More rounded corners */
        border: 1px solid #ddd;
        background-color: #f9f9f9; /* Light background for input */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        outline: none;
        transition: border-color 0.3s, box-shadow 0.3s;

        &:focus {
            border-color: #0d47a1;
            box-shadow: 0 0 5px rgba(13, 71, 161, 0.5);
        }
    }

    .search-button {
        width: 100%;
        max-width: 150px;
        height: 40px;
        padding: 10px;
        border: none;
        border-radius: 25px; /* Match input corners */
        background: linear-gradient(135deg, #0d47a1, #003c8f); /* Gradient background */
        color: white;
        font-size: 1rem;
        cursor: pointer;
        margin: 5px 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: background 0.3s, transform 0.1s;

        &:hover {
            background: linear-gradient(135deg, #003c8f, #002d72);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .result-card {
        border: none; /* Remove border for cleaner look */
        padding: 15px;
        margin: 10px 0;
        background: rgba(227, 242, 253, 0.9); /* Slightly transparent background */
        border-radius: 12px; /* Softer corners */
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
            transform: translateY(-3px); /* More pronounced lift */
            box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
        }
    }

    .result-info {
        margin: 5px 0;
        color: #0d47a1;
        font-weight: 600; /* Slightly bolder text for emphasis */
        font-size: 1.1rem; /* Increase font size */
    }

    .request-button {
        margin-top: 10px;
        padding: 8px 15px;
        border: none;
        border-radius: 25px; /* Match other buttons */
        background: linear-gradient(135deg, #0d47a1, #003c8f);
        color: white;
        cursor: pointer;
        transition: background 0.3s, transform 0.1s;

        &:hover {
            background: linear-gradient(135deg, #003c8f, #002d72);
        }

        &:active {
            transform: scale(0.95);
        }
    }
`;