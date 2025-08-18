import React from "react"
import './destack.css'
import useNavigation from "../../../hooks/useNavigation";
import { useAuth } from "../../../context/AuthContext";

function Destaks() {
    const { goTo } = useNavigation();
    const { Authenticated } = useAuth();
    return (
        <>
            <div className="destack">
                <div className="destack__container Section__container">
                    <div className="destack__content" id="about">
                        <div className="destack__text">
                            <div>
                                <h2 className="section__title">Communicate more efficiently by using <span>ChatBox.</span></h2>
                                <p className="section__description">
                                    Chat smarter with an AI that understands your needs. Whether it's casual conversation or quick answers, ChatBox is built to keep your communication smooth, productive, and effortless.
                                </p>
                            </div>
                            <div className="destack__stats">
                                <div className="stat" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                                    <h3 className="stat__title">1M+</h3>
                                    <p className="stat__description">Active Users</p>
                                </div>
                                <div className="stat" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                                    <h3 className="stat__title">2M+</h3>
                                    <p className="stat__description">Messages Sent</p>
                                </div>
                                <div className="stat" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="700">
                                    <h3 className="stat__title">2+</h3>
                                    <p className="stat__description">Active Years</p>
                                </div>
                            </div>
                        </div>

                        <div className="destack__image" data-aos="fade-left" data-aos-duration="1000">
                            <img src="/images/rigth_destack.png" alt="" />
                        </div>
                    </div>

                    <div className="destack__content" id="destack">
                        <div className="destack__image" data-aos="fade-right" data-aos-duration="1000">
                            <img src="/images/left_destack.png" alt="" />
                        </div>
                        <div className="destack__text">
                            <h2 className="section__title min">Send messages in <span>Real Time</span>, without any delay between us</h2>
                            <p className="section__description">
                                Experience seamless conversations where every message arrives instantly, keeping you connected as if you were in the same room
                            </p>
                            {(!Authenticated) && (
                                <div><button className="btn_3" data-aos="fade-up" onClick={() => goTo('/sign')}>Lean More</button></div>
                            )}
                            {(Authenticated) && (
                                <div><button className="btn_3" data-aos="fade-up" onClick={() => goTo('/chat')}>Chat Now</button></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Destaks