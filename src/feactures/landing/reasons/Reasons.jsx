import React from "react"
import './reasons.css'

function Reasons() {
    return (
        <>
            <div className="reasons">
                <div className="reasons__container Section__container">
                    <div className="reasons__text">
                        <span className="reasons__section">Featured</span>
                        <h3 className="section__title">Reasons why you should choose a <span>ChatBox.</span></h3>
                        <p className="section__description">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet pariatur officiis nostrum nemo?</p>
                    </div>

                    <div className="reasons__content">
                        <div className="reasons__card">
                            <figure className="icon">
                                <img src="/icons/faceHappy.svg" alt="" />
                            </figure>

                            <h5>Easy to use</h5>

                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio.</p>
                        </div>

                        <div className="reasons__card">
                            <figure className="icon">
                                <img src="/icons/alarm.svg" alt="" />
                            </figure>

                            <h5>Real Time</h5>

                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi.</p>
                        </div>

                        <div className="reasons__card">
                            <figure className="icon">
                                <img src="/icons/lock.svg" alt="" />
                            </figure>

                            <h5>Safety & Private</h5>

                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reasons