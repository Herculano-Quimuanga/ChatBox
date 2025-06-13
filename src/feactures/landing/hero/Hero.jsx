import React from "react"
import './hero.css'

function Hero() {
  return (
    <>
      <div className="hero">
        <div className="hero__container Section__container">
          <div className="hero__content">
            <p className="hero__title">Get the best <strong>experience</strong> when sending messages</p>

            <div className="hero__actions">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing. Labore excepturi quia zoue.</p>
              <button className="btn">
                <img src="/icons/user-blue.svg" alt="" />
                Log In
              </button>
              <button className="btn_2">
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
