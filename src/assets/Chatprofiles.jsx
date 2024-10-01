import React, { useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

function Chatprofiles({ correctUN , setChatWith }) {
    useEffect(() => {
        if (correctUN) {
            loadChatProfiles();
        }
    }, [correctUN])

    async function loadChatProfiles() {
        const response = await axios.post('http://localhost:5000/chat/loadProfiles');
        
        const profilesDiv = document.getElementById('profiles')

        profilesDiv.innerText = ''

        for (const temp of response.data) {
            const tempDiv = document.createElement('button')
            tempDiv.innerText = temp
            profilesDiv.appendChild(tempDiv);

            tempDiv.addEventListener('click' , () => {
                setChatWith(`${temp}`)
            });
        }
    }

    return (
        <Container>
            <Title>Chat Profiles</Title>
            <ProfilesContainer id='profiles'>
            </ProfilesContainer>
        </Container>
    )
}

export default Chatprofiles;

const Container = styled.div`
    position: fixed;
    top: 5.4vh;
    left: 75vw;
    right: 1vw;
    border: 2px solid #333;
    border-radius: 8px;
    background-color: #f9f9f9;
    padding: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: auto;
    max-height: 80vh;
    padding: 10px;
`

const Title = styled.h2`
    margin: 0;
    font-size: 1.2rem;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
`

const ProfilesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;

    button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        text-align: left;

        &:hover {
            background-color: #0056b3;
        }
    }
`