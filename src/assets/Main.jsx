import axios from 'axios';
import React, {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from './Modal';
import ReactPlayer from 'react-player';

function Main({ correctUN }) {
    const navigate = useNavigate();

    const [openModal, setopenModal] = useState(0)
    const [show, setShow] = useState("");
    const [likedby, setLikedby] = useState([]);
    const [commentor , setCommentor] = useState([]);
    const [comments, setComments] = useState([]);

    async function handleClick() {
        navigate('/post');
    }

    useEffect(() => {
        if (correctUN) {
            loadmain()
        }
    }, [correctUN])

    async function showLikes(sender, message) {
        const response = await axios.post('http://localhost:5000/like/showlikes', {
            sender, message
        })

        return response.data
    }

    async function showComments(sender, message) {
        const response = await axios.post('http://localhost:5000/like/showcomments', {
            sender, message
        })

        return response.data
    }

    async function checkLike(sender, message) {
        const response = await axios.post('http://localhost:5000/like/checklike', {
            correctUN, sender, message
        })

        return response.data
    }

    async function likePost(sender, message) {
        const response = await axios.post('http://localhost:5000/like/likepost', {
            correctUN, sender, message
        });
    }

    async function unlikePost(sender, message) {
        const response = await axios.post('http://localhost:5000/like/unlikePost', {
            correctUN, sender, message
        });
    }

    async function commentPost(sender, message, comment) {
        const response = await axios.post('http://localhost:5000/like/commentpost', {
            correctUN, sender, message, comment
        });
    }

    async function loadmain() {
        const response = await axios.post('http://localhost:5000/load/main', {
            correctUN
        });
    
        const mainDiv = document.getElementById('mainDiv');
        mainDiv.innerText = '';
    
        for (let i = response.data.message.length - 1; i >= 0; i--) {
            const div = document.createElement('div');
            div.style.border = '1px solid #ddd';
            div.style.padding = '15px';
            div.style.marginBottom = '20px';
            div.style.borderRadius = '8px';
            div.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    
            div.innerHTML += `<strong>Sender:</strong> ${response.data.sender[i]}<br/>`;
            div.innerHTML += `<strong>Message:</strong> ${response.data.message[i]}<br/>`;
    
            const date = new Date(response.data.date[i]);
            div.innerHTML += `<strong>Date:</strong> ${date.toLocaleDateString()} ${date.toLocaleTimeString()}<br/>`;
    
            // Display image if available
            if (response.data.url.photourl[i]) {
                const img = document.createElement('img');
                img.src = `http://localhost:5000/uploads/${response.data.url.photourl[i]}`;
                img.alt = 'Image';
                img.style.maxWidth = '100%';
                img.style.height = '200px';
                img.style.borderRadius = '10px';
                img.style.marginTop = '10px';
                div.appendChild(img);
            }
    
            if (response.data.url.videourl[i]) {
                const video = document.createElement('video');
                video.src = `http://localhost:5000/uploads/${response.data.url.videourl[i]}`;
                video.controls = true;
                video.style.maxWidth = '100%';
                video.style.height = '200px';
                video.style.borderRadius = '10px';
                video.style.marginTop = '10px';
                
                video.autoplay = false;
                video.loop = false;
                video.muted = false;
                
                div.appendChild(video);
            }            
    
            if (response.data.url.videolink[i]) {
                const videoLinkContainer = document.createElement('div');
                videoLinkContainer.style.marginTop = '10px';
    
                const videoLink = document.createElement('a');
                videoLink.href = response.data.url.videolink[i];
                videoLink.innerText = 'Watch Video';
                videoLink.target = '_blank';
                videoLink.style.color = '#2196F3';
                videoLinkContainer.appendChild(videoLink);
    
                div.appendChild(videoLinkContainer);
            }
    
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.marginTop = '10px';
    
            const buttonStyle = `
                padding: 10px 15px;
                font-size: 16px;
                background-color: green;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            `;
    
            const likeButton = document.createElement('button');
            const showlikesButton = document.createElement('button');
            const showcommentsButton = document.createElement('button');
    
            showcommentsButton.innerText = 'Show Comments';
            showcommentsButton.style.cssText = buttonStyle;
            showlikesButton.innerText = 'Show Likes';
            showlikesButton.style.cssText = buttonStyle;
            likeButton.innerText = 'Like';
            likeButton.style.cssText = buttonStyle;
    
            const senderr = response.data.sender[i];
    
            const isLiked = await checkLike(senderr, response.data.message[i]);
            if (isLiked) {
                likeButton.style.backgroundColor = 'red';
            } else {
                likeButton.style.backgroundColor = 'green';
            }
    
            likeButton.addEventListener('click', () => {
                if (likeButton.style.backgroundColor == 'green') {
                    likeButton.style.backgroundColor = 'red';
                    likePost(response.data.sender[i], response.data.message[i]);
                } else {
                    likeButton.style.backgroundColor = 'green';
                    unlikePost(response.data.sender[i], response.data.message[i]);
                }
            });
    
            showlikesButton.addEventListener('click', async () => {
                const thismsglikedby = await showLikes(response.data.sender[i], response.data.message[i]);
                setLikedby(thismsglikedby);
                setShow("likedby");
                setopenModal(1);
            });
    
            showcommentsButton.addEventListener('click', async () => {
                const tempp = await showComments(response.data.sender[i], response.data.message[i]);
                setCommentor(tempp.commentor);
                setComments(tempp.comment);
                setShow("comments");
                setopenModal(1);
            });
    
            const commentTextArea = document.createElement('textarea');
            commentTextArea.placeholder = 'Enter your comment...';
            commentTextArea.style.width = '100%';
            commentTextArea.style.marginTop = '10px';
            commentTextArea.style.resize = 'vertical';
    
            const postcommentbtn = document.createElement('button');
            postcommentbtn.innerText = 'Post Comment';
            postcommentbtn.style.cssText = buttonStyle;
            postcommentbtn.style.backgroundColor = '#2196F3';
            postcommentbtn.addEventListener('click', () => {
                const comment = commentTextArea.value;
                if (comment) {
                    commentPost(response.data.sender[i], response.data.message[i], comment);
                    commentTextArea.value = '';
                } else {
                    alert('Please enter a comment');
                }
            });
    
            buttonContainer.appendChild(likeButton);
            buttonContainer.appendChild(showlikesButton);
            buttonContainer.appendChild(showcommentsButton);
            buttonContainer.appendChild(postcommentbtn);
    
            div.appendChild(buttonContainer);
            div.appendChild(commentTextArea);
    
            mainDiv.appendChild(div);
        }    
    }

    return (
        <Container>
            <div id='startPost'>
                <div className='div1'>
                    <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' />
                    <button onClick={handleClick}>Start a Post</button>
                </div>

                <div className='div2'>
                    <button><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Picture_icon_COLORS.png/867px-Picture_icon_COLORS.png'
                        height='50px' /><p>Image</p></button>

                    <button><img src='https://cdn-icons-png.flaticon.com/512/126/126806.png'
                        height='50px' /><p>Video</p></button>

                    <button><img src='https://cdn-icons-png.flaticon.com/512/780/780575.png'
                        height='50px' /><p>Event</p></button>

                    <button><img src='https://cdn-icons-png.flaticon.com/512/991/991912.png'
                        height='50px' /><p>Write Article</p></button>
                </div>
            </div>

            <div id='mainDiv'></div>

            {openModal ? <Modal setopenModal={setopenModal} likedby={likedby} comments={comments} commentor={commentor} correctUN={correctUN} show={show} /> : ""}
        </Container>
    );
}

export default Main;

const Container = styled.div`
    margin-left: 25vw;
    width: 50%;
    padding: 20px;
    background-color: #f4f4f9;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    #startPost {
        border: 2px solid #d3d3d3;
        border-radius: 20px;
        padding: 20px;
        background-color: white;
        margin-bottom: 20px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

        .div1 {
            display: flex;
            align-items: center;

            img {
                border-radius: 50%;
                height: 60px;
                border: 3px solid #007bff;
            }

            button {
                width: 100%;
                margin: 20px;
                height: 5vh;
                border-radius: 20px;
                border: none;
                background-color: #007bff;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s ease;

                &:hover {
                    background-color: #0056b3;
                }
            }
        }

        .div2 {
            display: flex;
            justify-content: space-between;
            align-items: center;

            & > button {
                border: none;
                background-color: transparent;
                display: flex;
                align-items: center;
                cursor: pointer;
                transition: transform 0.2s ease;

                &:hover {
                    transform: scale(1.05);
                }

                p {
                    color: #007bff;
                    font-weight: 600;
                    margin-left: 10px;
                }

                img {
                    height: 50px;
                    width: 50px;
                }
            }
        }
    }

    #mainDiv {
        border: 2px solid #d3d3d3;
        border-radius: 20px;
        padding: 20px;
        background-color: white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        max-height: auto;

        div {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;

            &:hover {
                background-color: #dee2e6;
            }

            img {
                max-width: 100%;
                height: auto;
                border-radius: 10px;
                margin-top: 10px;
            }

            #player {
                margin-top: 10px;
            }
        }
    }

    button {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #0056b3;
        }
    }
`;