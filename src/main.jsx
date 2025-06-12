import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './feactures/landing/header/Header'
import Hero from './feactures/landing/hero/Hero'
import Reasons from './feactures/landing/reasons/Reasons'
import Destaks from './feactures/landing/destack/Destaks'
import Final from './feactures/landing/final/Final'
import Footer from './feactures/landing/footer/Footer'
import Login from './feactures/auth/login/login'
import Sign from './feactures/auth/sign/sign'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header/>
    <Hero></Hero>
    <Reasons></Reasons>
    <Destaks></Destaks>
    <Final></Final>
    <Footer/>
  </StrictMode>,
)
