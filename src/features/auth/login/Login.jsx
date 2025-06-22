import React, { useState } from 'react'
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { jwtDecode } from 'jwt-decode'
import { useGoogleLogin } from '@react-oauth/google'
import useNavigation from '../../../hooks/useNavigation'

function Login() {
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
    flow: 'implicit', // ou 'auth-code' quando usar backend
  });

  return (
    <div className='login'>
      <div className="login__container">

        <div className="login__text">
          <div className="logo" onClick={() => goTo('/home')}>
            <img src="icons/message.svg" alt="ChatBox Logo" />
            <span>ChatBox</span>
          </div>

          <div className="login__text__descriptions">
            <h2>Hello, Welcome Back.</h2>
            <p>Hey, welcome back to your special place</p>
          </div>

          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <form action="" method="post" className='Form__container'>
          <div className="form__content">
            <h3>Log in</h3>

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
                  onChange={(e) => setPassword(e.target.value)} name="" id="" placeholder='********' />
                <span
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button className="btn_3" type='button'>Log in</button>

            <p>Don´t have an account? <button type="button" className='GotoSignUp' onClick={() => goTo('/sign')}>Sign In</button></p>

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
              Log in with Google
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}

export default Login