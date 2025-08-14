import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import useNavigation from '../../../hooks/useNavigation';
import axios from 'axios';

function Login() {
  const { goTo } = useNavigation();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}api/usuarios/login`, form);
      const { user, token } = res.data;
      const userData = { ...user, token };
      localStorage.setItem("usuario", JSON.stringify(userData));
      goTo('/');
      window.location.reload();
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err.message);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const { name, email, picture } = googleRes.data;

        const res = await axios.post(`${import.meta.env.VITE_API_URL}api/usuarios/google`, {
          nome: name,
          email,
          photo: picture,
        });

        const { user, token } = res.data;

        // Corrigido:
        const userData = { ...user, token };
        localStorage.setItem("usuario", JSON.stringify(userData));

        goTo('/');
        window.location.reload();
      } catch (err) {
        console.error("Erro durante login com Google:", err);
      }
    },
    onError: () => {
      console.log("Erro no login com Google");
    },
  });

  return (
    <div className='account'>
      <div className="account__container">

        <div className="account__text">
          <div className="logo" onClick={() => goTo('/')}>
            <img src="icons/message.svg" alt="ChatBox Logo" />
            <span>ChatBox</span>
          </div>

          <div className="account__text__descriptions">
            <h2>Hello, Welcome Back.</h2>
            <p>Hey, welcome back to your special place</p>
          </div>

          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <form className="Form__container" onSubmit={handleSubmit}>
          <div className="form__content">
            <h3>Log in</h3>

            <div className="form__camp">
              <label htmlFor="emailUser">Email address</label>
              <div className="Input__Camp">
                <i>
                  <img src="/icons/envelope.svg" alt="" />
                </i>
                <input
                  type="email"
                  name="email"
                  id="emailUser"
                  placeholder='youremail@gmail.com'
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form__camp">
              <label htmlFor="PassUser">Password</label>
              <div className="Input__Camp">
                <i>
                  <img src="/icons/lock.svg" alt="" />
                </i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  id="PassUser"
                  placeholder='********'
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
                <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button className="btn_3" type="submit">Log in</button>

            <p>Don't have an account? <button type="button" className='GotoSignUp' onClick={() => goTo('/sign')}>Sign Up</button></p>

            <div className="outhers">
              <span></span>
              <small>Or</small>
              <span></span>
            </div>

            <button type="button" onClick={loginGoogle} className='LogGoogle'>
              <img src="/icons/google.svg" alt="Google" width="18" height="18" />
              Log in with Google
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
