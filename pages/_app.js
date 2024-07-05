// pages/_app.js

import '../styles/globals.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from "../components/Pages/HomePage"
import RoomPage from "../components/Pages/RoomPage"
import RoomIdPage from "../components/Pages/RoomIdPage"
function MyApp() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return null; // Or a loading spinner, or nothing
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/room/:code" element={<RoomIdPage />} />
      </Routes>
    </Router >
  );
}

export default MyApp;
