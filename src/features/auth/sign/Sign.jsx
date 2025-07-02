import './sign.css';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import useNavigation from '../../../hooks/useNavigation';
import axios from 'axios';

function Sign() {
  const { goTo } = useNavigation();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/usuarios/register", form);
      console.log("Usuário cadastrado:", res.data.user);
      localStorage.setItem("usuario", JSON.stringify(res.data.user));
      goTo('/home');
    } catch (err) {
      console.error("Erro no cadastro:", err.response?.data || err.message);
      alert("Erro no cadastro: " + (err.response?.data?.error || err.message));
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

        const res = await axios.post("http://localhost:3000/api/usuarios/google", {
          nome: name,
          email,
          photo: picture,
        });

        console.log("Usuário Criado e Autenticado:", res.data.user);
        localStorage.setItem("usuario", JSON.stringify(res.data.user));
        goTo('/home');
      } catch (err) {
        console.error("Erro durante login com Google:", err);
        alert("Erro no login com Google");
      }
    },
    onError: () => {
      console.log("Erro no login com Google");
    },
  });

  return (
    <div className='account'>
      <div className="account__container">

        <form className='Form__container' onSubmit={handleSubmit}>
          <div className="form__content">
            <h3>Sign in</h3>

            <div className="form__camp">
              <label htmlFor="NameUser">User name</label>
              <div className="Input__Camp">
                <i><img src="/icons/user-fill.svg" alt="" /></i>
                <input
                  type="text"
                  name="nome"
                  id="NameUser"
                  placeholder="Enter your name"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form__camp">
              <label htmlFor="emailUser">Email address</label>
              <div className="Input__Camp">
                <i><img src="/icons/envelope.svg" alt="" /></i>
                <input
                  type="email"
                  name="email"
                  id="emailUser"
                  placeholder="youremail@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form__camp">
              <label htmlFor="PassUser">Password</label>
              <div className="Input__Camp">
                <i><img src="/icons/lock.svg" alt="" /></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  id="PassUser"
                  placeholder="Enter your password"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
                <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button className="btn_3" type="submit">Sign In</button>

            <p>Have an account? <button type="button" className="GotoSignUp" onClick={() => goTo('/login')}>Log In</button></p>

            <div className="outhers">
              <span></span>
              <small>Or</small>
              <span></span>
            </div>

            <button type="button" onClick={loginGoogle} className="LogGoogle">
              <img src="/icons/google.svg" alt="Google" width="18" height="18" />
              Sign In with Google
            </button>

          </div>
        </form>

        <div className="account__text">
          <div className="logo" onClick={() => goTo('/home')}>
            <img src="icons/message.svg" alt="ChatBox Logo" />
            <span>ChatBox</span>
          </div>

          <div className="account__text__descriptions">
            <h2>Get Started Now.</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sign;
