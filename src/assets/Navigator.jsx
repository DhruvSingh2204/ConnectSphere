import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { Link } from 'react-router-dom';

function Navigator() {
    const [burgerStatus, setBurgerStatus] = useState(true);

    function handleLogout() {
        localStorage.removeItem('user');
        localStorage.removeItem('email')
        setCorrectUN('');
        setCorrectEmail('');
    }

    return (
        <Container>
            <div id='controller'>
                {!burgerStatus ? <IoMenu onClick={() => setBurgerStatus(!burgerStatus)}/> : 
                <RxCross1 onClick={() => setBurgerStatus(!burgerStatus)} />}
            </div>
            <BurgerNav BurgerStatus={burgerStatus}>
                <li><Link to="/main">Home</Link></li>
                <li><a href="/chat">Chat</a></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
                <li><Link to="/req">Notifications</Link></li>
                <li><a href="#">More</a></li>
                <li><Link to="/" onClick={handleLogout}>LogOut</Link></li>
            </BurgerNav>
        </Container>
    );
}

export default Navigator;

const BurgerNav = styled.div`
    position: fixed;
    width:200px;
    top: 45px;
    left:0;
    transform: ${props => props.BurgerStatus ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease-out;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-right: 1px solid gray;
    bottom: 50px;

    li {
        list-style: none;
        padding: 15px 0;
        border-bottom: 1px solid gray;
        width: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        margin-left: 20px;
    a {
        font-weight: 600;
        text-decoration: none;
        color: black;
    }
    }

    li:hover {
        background-color: #A0A0A0;
    }
`

const Container = styled.div`
    font-size: 2rem;
`