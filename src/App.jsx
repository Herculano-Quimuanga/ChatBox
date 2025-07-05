// src/App.jsx
import { Routes, Route } from 'react-router-dom';
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
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <Banner />
              <Reasons />
              <Destaks />
              <Final />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path='/home' element={<App />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
