import React, { useEffect, useState, useRef } from 'react';
import "./header.css";
import "../../../index.css";
import useNavigation from '../../../hooks/useNavigation';
import { useAuth } from '../../../context/AuthContext';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { goTo } = useNavigation();
  const dropdownRef = useRef();
  const { Authenticated } = useAuth();

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      const user = JSON.parse(usuarioSalvo);
      if (user) {
        if (user.photo) {
          setUserPhoto(user.photo);
        } else if (user.nome) {
          setUserInitial(user.nome.charAt(0).toUpperCase());
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    goTo("/login");
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleHeaderMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <div className={scrolled ? 'header scrolled' : 'header'}>
      <header className="header__container Section__container">
        <div className="logo" onClick={() => goTo('/home')}>
          <img src="icons/message.svg" alt="ChatBox Logo" />
          <span>ChatBox</span>
        </div>

        <nav className={`header__nav ${isMenuOpen ? 'show' : ''}`}>
          <ul>
            <li><a href="#hero" className="header__links" onClick={toggleHeaderMenu}>Home</a></li>
            <li><a href="#reasons" className="header__links" onClick={toggleHeaderMenu}>Reasons</a></li>
            <li><a href="#about" className="header__links" onClick={toggleHeaderMenu}>About</a></li>
            <li><a href="#destack" className="header__links" onClick={toggleHeaderMenu}>Destack</a></li>
          </ul>

          {(userPhoto || userInitial) && (
            <div className="user__dropdown" ref={dropdownRef}>
              <div className="logo__User" title="Conta" onClick={toggleMenu} style={{ cursor: "pointer" }}>
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="User"
                    style={{ width: "35px", height: "35px", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <span className='Logo__Letter'>{userInitial}</span>
                )}
              </div>

              {menuOpen && (
                <div className="dropdown__menu">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="header__buttons">
          {!userInitial && !userPhoto && (
            <button className="btn" onClick={() => goTo('/login')}>Try For Free</button>
          )}
        </div>

        <div className="header__menu__toggle">
          <button type="button" onClick={toggleHeaderMenu}>
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
