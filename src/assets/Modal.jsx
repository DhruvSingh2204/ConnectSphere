import React, { useEffect } from 'react';
import styled from 'styled-components';
import { IoMdCloseCircleOutline } from "react-icons/io";

function Modal(props) {
    useEffect(() => {
        if (props.show === "followers" && props.followers.length > 0) {
            if (props.following.length == 1) {
                document.getElementById('maindiv').innerText = 'No Followers'
                return;
            }
            const followersList = document.getElementById('maindiv');
            followersList.innerText = `Followers of ${props.correctUN} are - `

            props.followers.forEach(follower => {
                if (follower != props.correctUN) {
                    const div = document.createElement('div');
                    div.innerText = follower;
                    followersList.appendChild(div);
                }
            });
        }

        if (props.show == "following") {
            if (props.following.length == 0) {
                document.getElementById('maindiv').innerText = 'No Following'
                return;
            }

            const followingList = document.getElementById('maindiv');
            followingList.innerText = `Following are - `

            props.following.forEach(following => {
                const div = document.createElement('div');
                div.innerText = following;
                followingList.appendChild(div);
            });
        }

        if (props.show == "likedby") {
            if(props.likedby.length == 0) {
                document.getElementById('maindiv').innerText = `No Likes on this Post`
                return;
            }

            const likedbyList = document.getElementById('maindiv');
            likedbyList.innerText = 'This Post is Liked by - '

            props.likedby.forEach(liker => {
                const div = document.createElement('div');
                div.innerText = liker;
                likedbyList.appendChild(div);
            });
        }

        if(props.show == "comments") {
            if(!props.commentor || !props.comments || props.commentor.length == 0 || props.comments?.length == 0) {
                document.getElementById('maindiv').innerText = `No Comments on this Post`
                return;
            }

            const commentsList = document.getElementById('maindiv');
            commentsList.innerText = 'Comments - '

            for(let i = props.comments.length - 1;i >= 0;i--) {
                const div = document.createElement('div');
                div.innerText = props.commentor[i];
                div.innerText += ' -> '
                div.innerText += props.comments[i];
                commentsList.appendChild(div);
            }
        }
    }, [props.followers, props.show, props.following , props.likedby , props.comments , props.commentor]);

    return (
        <Backdrop>
            <ModalContent>
                <button onClick={() => props.setopenModal(0)}><IoMdCloseCircleOutline /></button>
                <div id='maindiv'>

                </div>
            </ModalContent>
        </Backdrop>
    );
}

export default Modal;

const Backdrop = styled.div`
    position: fixed;
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.722);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 101;
    color: black;
    text-align: center;
`;