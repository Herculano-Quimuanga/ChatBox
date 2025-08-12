// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './features/landing/header/Header';
import Hero from './features/landing/hero/Hero';
import Banner from './features/landing/banner/Banner';
import Reasons from './features/landing/reasons/Reasons';
import Destaks from './features/landing/destack/Destaks';
import Final from './features/landing/final/Final';
import Footer from './features/landing/footer/Footer';
import Login from './features/auth/login/Login';
import Sign from './features/auth/sign/Sign';
import Chat from './features/chat/Chat';
import ListUsers from './features/landing/listUsers/ListUsers';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Hero />
            <Banner />
            <Reasons />
            <ListUsers />
            <Destaks />
            <Final />
            <Footer />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />

        {/* Chat: sem param ou com param (mesmo componente) */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:userId" element={<Chat />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}

export default App;
