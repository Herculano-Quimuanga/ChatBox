import './sign.css'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { jwtDecode } from 'jwt-decode'
import { useGoogleLogin } from '@react-oauth/google'
import useNavigation from '../../../hooks/useNavigation'

function Sign() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { goTo } = useNavigation();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.credential || tokenResponse.access_token;
      const user = jwtDecode(token);
      console.log('Usuário:', user);
    },
    onError: () => {
      console.error('Falha ao autenticar com Google');
    },
    flow: 'implicit',
  });

  return (
    <div className='sign'>
      <div className="sign__container">

        <form action="" method="post" className='Form__container'>
          <div className="form__content">
            <h3>Sign in</h3>

            <div className="form__camp">
              <label htmlFor="emailUser">User name</label>
              <div className="Input__Camp">
                <i>
                  <img src="/icons/user-fill.svg" alt="" />
                </i>
                <input type="text" name="" id="" placeholder='Enter your name' />
              </div>
            </div>


            <div className="form__camp">
              <label htmlFor="emailUser">Email address</label>
              <div className="Input__Camp">
                <i>
                  <img src="/icons/envelope.svg" alt="" />
                </i>
                <input type="email" name="" id="" placeholder='youremail@gmail.com' />
              </div>
            </div>

            <div className="form__camp">
              <label htmlFor="emailUser">Password</label>
              <div className="Input__Camp">
                <i>
                  <img src="/icons/lock.svg" alt="" />
                </i>
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} name="" id="" placeholder='Enter your password' />
                <span
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button className="btn_3" type='button'>Sign In</button>

            <p>Have an account? <button type="button" className='GotoSignUp' onClick={() => goTo('/login')}>Log In</button></p>

            <div className="outhers">
              <span></span>
              <small>Or</small>
              <span></span>
            </div>

            <button type="button" onClick={() => login()} className='LogGoogle'>
              <img
                src="/icons/google.svg"
                alt="Google"
                width="18"
                height="18"
              />
              Sign In with Google
            </button>

          </div>
        </form>

        <div className="sign__text">
          <div className="logo" onClick={() => goTo('/home')}>
            <img src="icons/message.svg" alt="ChatBox Logo" />
            <span>ChatBox</span>
          </div>

          <div className="sign__text__descriptions">
            <h2>Get Started Now.</h2>
            <p>Enter your credentials to access your acconut</p>
          </div>

          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sign