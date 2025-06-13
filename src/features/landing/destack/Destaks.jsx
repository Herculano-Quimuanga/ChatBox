import React from "react"
import './destack.css'

function Destaks() {
    return (
        <>
            <div className="destack">
                <div className="destack__container Section__container">
                    <div className="destack__content" id="about">
                        <div className="destack__text">
                            <h2 className="section__title">Communicate more efficiently by using <span>ChatBox.</span></h2>
                            <p className="section__description">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias est cum voluptates. Dicta neque consequatur repellat minus similique labore placeat.
                            </p>
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
                            <img src="/images/right-destack.png" alt="" />
                        </div>
                    </div>

                     <div className="destack__content" id="destack">
                         <div className="destack__image" data-aos="fade-right" data-aos-duration="1000">
                            <img src="/images/left-destack.png" alt="" />
                        </div>
                        <div className="destack__text">
                            <h2 className="section__title min">Send messages in <span>Real Time</span>, without any delay between us</h2>
                            <p className="section__description">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias est cum voluptates. Dicta neque consequatur repellat minus similique labore placeat.
                            </p>
                            <button className="btn_3" data-aos="fade-up">Lean More</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Destaks