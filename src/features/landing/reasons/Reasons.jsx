import React from "react"
import './reasons.css'

function Reasons() {
    return (
        <>
            <div className="reasons" id="reasons">
                <div className="reasons__container Section__container">
                    <div className="reasons__text">
                        <span className="reasons__section">Featured</span>
                        <h3 className="section__title">Reasons why you should choose a <span>ChatBox.</span></h3>
                        <p className="section__description">Discover how ChatBox makes your conversations smarter, faster, and more secure — all in one simple platform.</p>
                    </div>

                    <div className="reasons__content">
                        <div className="reasons__card" data-aos="flip-left" data-aos-duration="1000">
                            <figure className="icon">
                                <img src="/icons/faceHappy.svg" alt="" />
                            </figure>

                            <h5>Easy to use</h5>

                            <p>No complex setup or learning curve — just start chatting instantly with an intuitive and clean interface.</p>
                        </div>

                        <div className="reasons__card" data-aos="flip-left" data-aos-duration="1000" data-aos-delay="500">
                            <figure className="icon">
                                <img src="/icons/alarm.svg" alt="" />
                            </figure>

                            <h5>Real Time</h5>

                            <p>Get instant responses from our AI, keeping your conversations smooth and engaging without delays.</p>
                        </div>

                        <div className="reasons__card" data-aos="flip-left" data-aos-duration="1000" data-aos-delay="1000">
                            <figure className="icon">
                                <img src="/icons/lock-fill.svg" alt="" />
                            </figure>

                            <h5>Safety & Private</h5>

                            <p>Your chats are encrypted and protected. We respect your privacy and never share your data.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reasons