import React, { useState } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Post({ correctUN }) {
    const [editorText, setEditorText] = useState("");
    const [shareImage, setShareImage] = useState(null);
    const [shareVideo, setShareVideo] = useState(null);
    const [videoLink, setVideoLink] = useState("");
    const navigate = useNavigate();

    async function postArticle() {
        if (editorText === '') {
            return;
        }

        // Create FormData to send images and videos
        const formData = new FormData();
        formData.append('correctUN', correctUN);
        formData.append('editorText', editorText);

        if (shareImage) {
            formData.append('shareImage', shareImage);  // Add image to FormData
        }

        if (shareVideo) {
            formData.append('shareVideo', shareVideo);  // Add video to FormData
        }

        formData.append('videoLink', videoLink);  // Add video link

        const response = await axios.post('http://localhost:5000/post/article', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        navigate('/main');
    }

    function handleChange(e) {
        const image = e.target.files[0];

        if (!image) {
            alert(`Not a valid image`);
            return;
        }

        setShareImage(image);
    }

    function handleChange2(e) {
        const video = e.target.files[0];

        if (!video) {
            alert(`Not a valid video`);
            return;
        }

        setShareVideo(video);
    }

    return (
        <Container>
            <input
                id='input'
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                placeholder='What do you want to talk about?'
            >
            </input>

            <input
                type='text'
                value={videoLink}
                onChange={(e) => {
                    setVideoLink(e.target.value);
                    setShareVideo(null);
                }}
                placeholder='Please input video link or select from your PC'
                id='videolink'
            />

            <div id='imgvid'>
                <div id='uploadImage'>
                    <input
                        type='file'
                        name='image'
                        id='file'
                        accept='image/gif, image/jpeg, image/png'
                        onChange={handleChange}
                        style={{ display: 'none', height: '100px' }}
                    />
                </div>

                <div id='uploadVideo'>
                    <input
                        type='file'
                        name='video'
                        id='video'
                        accept="video/mp4, video/mpeg, video/webm"
                        onChange={handleChange2}
                        style={{ display: 'none', height: '200px' }}
                    />
                </div>
            </div>

            {videoLink && <ReactPlayer width='100%' url={videoLink} />}
            {shareVideo && (<video src={URL.createObjectURL(shareVideo)} controls height='100px' />)}
            {shareImage && <img src={URL.createObjectURL(shareImage)} alt="Selected" />}

            <div id='share'>
                <div id='leftShare'>
                    <label htmlFor='file' style={{ cursor: 'pointer' }}>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png' height='40px' alt="Upload" />
                    </label>

                    <label htmlFor='video' style={{ cursor: 'pointer' }}>
                        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCoWX4nfm7FIfAKZsmoj5Ak_f4TLDrS4bQvg&s' height='40px' alt="Upload" />
                    </label>
                </div>
                <button
                    id='postBtn'
                    style={{ backgroundColor: editorText === "" ? 'red' : 'green' }}
                    onClick={postArticle}
                >
                    Post
                </button>
            </div>
        </Container>
    );
}

export default Post;

const Container = styled.div`
    margin-left: 25vw;
    width: 50%;
    padding: 20px;
    background-color: #f4f4f9;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    #input, #videolink {
        width: 100%;
        height: 5vh;
        border-radius: 10px;
        border: 1px solid #ccc;
        padding: 10px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.3s ease;

        &:focus {
            border-color: #007bff;
        }
    }

    #imgvid {
        display: flex;
        justify-content: space-around;
        width: 100%;
        margin: 10px 0;
    }

    #uploadImage, #uploadVideo {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        input {
            display: none;
        }

        label {
            cursor: pointer;
            transition: transform 0.2s ease;

            &:hover {
                transform: scale(1.05);
            }
        }
    }

    video, img {
        width: 100%;
        max-height: 200px;
        object-fit: cover;
        border-radius: 10px;
        margin-top: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    #share {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-top: 20px;

        #leftShare {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        #postBtn {
            padding: 10px 20px;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 20px;
            border: none;
            color: white;
            cursor: pointer;
            background-color: ${props => (props.disabled ? 'red' : 'green')};
            transition: background-color 0.3s ease;

            &:hover {
                background-color: ${props => (props.disabled ? '#ff4d4d' : '#28a745')};
            }
        }
    }
`;