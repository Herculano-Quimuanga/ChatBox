import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './features/landing/header/Header'
import Hero from './features/landing/hero/Hero'
import Banner from './features/landing/banner/Banner'
import Reasons from './features/landing/reasons/Reasons'
import Destaks from './features/landing/destack/Destaks'
import Final from './features/landing/final/Final'
import Footer from './features/landing/footer/Footer'
import Login from './features/auth/login/login'
import Sign from './features/auth/sign/sign'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react'

function Main() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: false,     
    });
  }, []);

  return (
    <>
      <Header/>
      <Hero />
      <Banner />
      <Reasons />
      <Destaks />
      <Final />
      <Footer/>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
