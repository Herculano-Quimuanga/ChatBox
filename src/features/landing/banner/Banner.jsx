import React from 'react'
import './banner.css'

function Banner() {
    return (
        <div className='banner'>
            <div className="banner__image Section__container">
                <div className="banner__content">
                    <img src="images/img-banner.png" alt="" data-aos="zoom-in" />

                    <div className="logos__brands">
                        {/* <img src="images/stripe-logo.png" alt="" />
                        <img src="images/afterpay-logo.png" alt="" />
                        <img src="images/hopin-logo.png" alt="" />
                        <img src="images/splunk-logo.png" alt="" />
                        <img src="images/attentive-logo.png" alt="" /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner