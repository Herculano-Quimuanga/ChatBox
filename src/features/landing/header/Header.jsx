import React from "react";
import { useEffect, useState } from 'react';
import "./header.css";
import "../../../index.css"; // Import global styles

function Header() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={scrolled ? 'header scrolled' : 'header'}>
        <header className="header__container Section__container">
          <div className="logo">
            <img src="icons/message.svg" alt="ChatBox Logo" />
            <span>ChatBox</span>
          </div>

          <nav className="header__nav">
            <ul>
              <li>
                <a href="#hero" className="header__links">Home</a>
              </li>
              <li>
                <a href="#reasons" className="header__links">Reasons</a>
              </li>
              <li>
                <a href="#about" className="header__links">About</a>
              </li>
              <li>
                <a href="#destack" className="header__links">Destack</a>
              </li>
            </ul>
          </nav>

          <div className="header__buttons">
            <button className="btn">Try For Free</button>
          </div>
        </header>
      </div>
    </>
  );
}

export default Header;
