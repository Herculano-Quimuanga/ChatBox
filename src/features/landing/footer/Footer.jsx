import React from "react"
import './footer.css'

function Footer() {
  return (
    <>
      <div className="footer">
        <div className="footer__container Section__container">

          <div className="footer__top">
            <h1 data-aos="fade-down" data-aos-duration="1000">Want to stay Connected?</h1>

            <div className="footer__btns" data-aos="fade-down" data-aos-duration="1000">
              <button className="btn_3">
                <img src="/icons/user.svg" alt="" />
                Log In
              </button>
              <button className="btn_2">
                <img src="/icons/user-plus.svg" alt="" />
                Sign In
              </button>
            </div>
          </div>

          <div className="footer__content">
            <div className="footer__description" data-aos="fade-up" data-aos-duration="1000">
              <div className="logo">
                <img src="icons/message.svg" alt="ChatBox Logo" />
                <span>ChatBox</span>
              </div>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta error aliquam obcaecati dolorem.</p>
              <h4>Luanda - Angola | KK. R. 2B</h4>
            </div>
            <div className="footer__links">
              <ul data-aos="fade-up" data-aos-duration="1000">
                <h3>Home</h3>
                <li><a href="#about">About Us</a></li>
                <li><a href="#reasons">Reasons</a></li>
                <li><a href="#destack">Destack</a></li>
              </ul>

              <ul data-aos="fade-up" data-aos-duration="1000">
                <h3>Features</h3>
                <li><a href="#">Log in</a></li>
                <li><a href="#">Sign in</a></li>
              </ul>

              <ul data-aos="fade-up" data-aos-duration="1000">
                <h3>Social Midia</h3>
                <li><a href="#">GitHub</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Facebook</a></li>
              </ul>
            </div>
          </div>

          <div className="footer__copy">
            <p>All right reserved by ChatBox - Herculano Quimuanga</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
