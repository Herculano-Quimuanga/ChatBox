import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './feactures/landing/header/Header'
import Hero from './feactures/landing/hero/Hero'
import Banner from './feactures/landing/banner/Banner'
import Reasons from './feactures/landing/reasons/Reasons'
import Destaks from './feactures/landing/destack/Destaks'
import Final from './feactures/landing/final/Final'
import Footer from './feactures/landing/footer/Footer'
import Login from './feactures/auth/login/login'
import Sign from './feactures/auth/sign/sign'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react'

function Main() {
  useEffect(() => {
    AOS.init({
      duration: 1500, 
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
