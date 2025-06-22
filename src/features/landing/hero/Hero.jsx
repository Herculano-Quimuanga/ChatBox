import React from "react"
import './hero.css'
import useNavigation from "../../../hooks/useNavigation";

function Hero() {
  const { goTo } = useNavigation();
  return (
    <>
      <div className="hero" id="hero">
        <div className="hero__container Section__container">
          <div className="hero__content">
            <p className="hero__title" data-aos="fade-up" data-aos-duration="1500">Get the best <strong>experience</strong> when sending messages</p>

            <div className="hero__actions" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
              <p>Chat instantly with a smart AI designed to understand and respond naturally. Fast, secure, and always available to talk.</p>
              <button className="btn" onClick={() => goTo('/login')}>
                <img src="/icons/user-blue.svg" alt="" />
                Log In
              </button>
              <button className="btn_2" onClick={() => goTo('/sign')}>
                <img src="/icons/user-plus.svg" alt="" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
