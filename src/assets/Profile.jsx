import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from './Modal'

function Profile({ correctUN, correctEmail }) {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const [openModal, setopenModal] = useState(0)
    const [show, setShow] = useState("");

    useEffect(() => {
        if (correctUN) {
            findFriends();
        }
    }, [correctUN])

    async function findFriends() {
        const response = await axios.post('http://localhost:5000/req/findno', {
            correctUN,
        });
    
        const newFollowers = [];
        for (const temp of response.data) {
            newFollowers.push(temp);
        }
        setFollowers(newFollowers);
    
        const response2 = await axios.post('http://localhost:5000/req/findFollowing', {
            correctUN,
        });
    
        const newFollowing = [];
        for (const temp2 of response2.data) {
            newFollowing.push(temp2);
        }
        setFollowing(newFollowing);
    
        document.getElementById('noOfFriends').innerText = response.data.length - 1;
        document.getElementById('noOfFriends').innerHTML += '<span>   Followers   </span>';
        document.getElementById('noOfFriends2').innerText = response2.data.length;
        document.getElementById('noOfFriends2').innerHTML += '<span>   Following</span>';
    
        await loadPosts();
    }

    async function loadPosts() {
        const response = await axios.post('http://localhost:5000/req/posts', {
            correctUN
        });

        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';

        for (let i = response.data.messages.length - 1; i >= 0; i--) {
            const message = response.data.messages[i];
            const date = new Date(response.data.dates[i]);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

            const div = document.createElement('div');
            div.className = 'post';

            div.style.backgroundColor = '#ffffff';
            div.style.border = '1px solid #ddd';
            div.style.borderRadius = '8px';
            div.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            div.style.margin = '10px 0';
            div.style.padding = '15px';
            div.style.fontFamily = 'Arial, sans-serif';
            div.style.color = '#333';
            div.style.lineHeight = '1.6';

            div.innerHTML = `<p><strong>Message:</strong> ${message}</p><p><strong>Date:</strong> ${formattedDate}</p>`;

            postsContainer.appendChild(div);
        }
    }

    function showfollowing() {
        setopenModal(1);
        setShow("following")
    }

    function showfollowers() {
        setopenModal(1);
        setShow("followers")
    }
    
    return (
        <Container>
            <div id='div1'>
                <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' />
                <div id='topDiv'>
                    <div id='topInDiv'>
                        <h3>{correctUN}</h3>
                        <button>Edit Profile</button>
                        <button>Settings</button>
                    </div>
                    <h5 id='email'>Email - {correctEmail}</h5>
                    <h4 id='friends-container'>
                        <button onClick={showfollowers} id='noOfFriends'></button>
                        <div id='followers-list'>
                        </div>
                    </h4>
                    <h4 id='following-container'>
                        <button onClick={showfollowing} id='noOfFriends2'></button>
                        <div id='following-list'>
                        </div>
                    </h4>
                </div>
            </div>

            <div id='DescriptionDiv'>
                <h1>MY POSTS</h1>

                <div id='posts'></div>
            </div>

            {openModal ? <Modal setopenModal={setopenModal} correctUN={correctUN} followers={followers} following={following} show={show} /> : ""}
        </Container>
    )
}

export default Profile

const Container = styled.div`
    margin-left: 25vw;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    #div1 {
        width: 80%;
        border-bottom: 2px solid #ccc;
        display: flex;
        padding-bottom: 10px;
        align-items: center;

        img {
            height: 100px;
            border-radius: 50%;
            margin-right: 20px;
            border: 3px solid #007bff;
        }
    }

    #topDiv {
        display: flex;
        flex-direction: column;
        width: 60%;
        align-items: flex-start;
        margin-bottom: 20px;

        h5 {
            color: #555;
            margin: 5px 0;
        }

        h4 {
            margin: 10px 0;
        }
    }

    #topInDiv {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;

        button {
            padding: 10px 15px;
            border-radius: 25px;
            border: none;
            font-weight: bold;
            margin-left: 10px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;

            &:first-child {
                background-color: #28a745;
            }

            &:nth-child(2) {
                background-color: #17a2b8;
            }

            &:hover {
                transform: translateY(-2px);
            }
        }
    }

    #DescriptionDiv {
        margin-top: 20px;
        width: 80%;

        h1 {
            text-align: center;
            color: #007bff;
            font-weight: bold;
            text-shadow: 1px 1px 2px #aaa;
            margin-bottom: 20px;
        }
    }

    #posts {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;

        .post {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            color: #343a40;
            font-weight: 500;
            font-size: 16px;

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
            }

            &:nth-child(3n) {
                background-color: #e1f7e1;
            }

            &:nth-child(2n) {
                background-color: #fef4e1;
            }
        }
    }

    button {
        padding: 8px 12px;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #0056b3;
        }
    }
`;
