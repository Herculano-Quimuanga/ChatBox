import React, { useEffect, useState } from 'react';
import "./header.css";
import "../../../index.css";
import useNavigation from '../../../hooks/useNavigation';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const { goTo } = useNavigation();

  return (
    <div className={scrolled ? 'header scrolled' : 'header'}>
      <header className="header__container Section__container">
        <div className="logo" onClick={() => goTo('/home')}>
          <img src="icons/message.svg" alt="ChatBox Logo" />
          <span>ChatBox</span>
        </div>

        <nav className={`header__nav ${isMenuOpen ? 'show' : ''}`}>
          <ul>
            <li><a href="#hero" className="header__links" onClick={toggleMenu}>Home</a></li>
            <li><a href="#reasons" className="header__links" onClick={toggleMenu}>Reasons</a></li>
            <li><a href="#about" className="header__links" onClick={toggleMenu}>About</a></li>
            <li><a href="#destack" className="header__links" onClick={toggleMenu}>Destack</a></li>
          </ul>
        </nav>

        <div className="header__buttons">
          <button className="btn" onClick={() => goTo('/login')}>Try For Free</button>
        </div>

        <div className="header__menu__toggle">
          <button type="button" onClick={toggleMenu}>
            <img
              src={isMenuOpen ? "icons/close.svg" : "icons/menu.svg"}
              alt="menu"
            />
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;
