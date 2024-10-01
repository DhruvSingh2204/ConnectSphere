import React, { useState, useEffect } from "react";
import Login from './assets/Login';
import Navigator from "./assets/Navigator";
import Profile from "./assets/Profile";
import Main from "./assets/Main";
import Post from "./assets/Post"
import Search from "./assets/Search"
import Req from "./assets/Req";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from "./assets/Chat";
import Chatprofiles from "./assets/Chatprofiles";

function App() {
  const [correctUN, setCorrectUN] = useState('');
  const [correctEmail, setCorrectEmail] = useState('');
  const [chatWith, setChatWith] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Get the userName from localStorage
    const storedEmail = JSON.parse(localStorage.getItem('email')); // Get the email from localStorage

    if (storedUser) {
      setCorrectUN(storedUser); // Since storedUser is just the username string
    }

    if (storedEmail) {
      setCorrectEmail(storedEmail); // Since storedEmail is just the email string
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login setCorrectUN={setCorrectUN} setCorrectEmail={setCorrectEmail} />}
          />
          <Route
            path="/main"
            element={<><Navigator /><Main correctUN={correctUN} /></>}
          />
          <Route
            path="/profile"
            element={<><Navigator /><Profile correctUN={correctUN} correctEmail={correctEmail} /></>}
          />
          <Route
            path="/post"
            element={<><Navigator /><Post correctUN={correctUN} /></>}
          />
          <Route
            path="/search"
            element={<><Navigator /><Search correctUN={correctUN} /></>}
          />
          <Route
            path="/req"
            element={<><Navigator /><Req correctUN={correctUN} /></>}
          />
          <Route
            path="/chat"
            element={<><Navigator /><Chat correctUN={correctUN} chatWith={chatWith} /><Chatprofiles correctUN={correctUN} setChatWith={setChatWith} /></>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;