import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Chat() {
  const { Authenticated } = useAuth();
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');
  const [conversa, setConversa] = useState([]);
  const mensagensRef = useRef(null);

  useEffect(() => {
    if (!Authenticated) {
      navigate('/login');
      return;
    }

    const fetchHistorico = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat/${Authenticated.id}`);
        setConversa(res.data);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
      }
    };

    fetchHistorico();
  }, [Authenticated, navigate]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [conversa]);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() || !Authenticated) return;

    const novaEntrada = { sender: 'user', text: mensagem };
    setConversa((prev) => [...prev, novaEntrada]);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        user_id: Authenticated.id,
        mensagem,
      });

      const respostaIA = res.data.resposta;
      setConversa((prev) => [...prev, { sender: 'ia', text: respostaIA }]);
      setMensagem('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  if (!Authenticated) return null;

  return (
    <div className="chat__container">
      <h2>Chat com IA</h2>

      <div className="chat__mensagens" ref={mensagensRef}>
        {conversa.map((msg, index) => (
          <div key={index} className={`chat__mensagem ${msg.sender}`}>
            <img
              src={
                msg.sender === 'user'
                  ? Authenticated.photo || '/icons/user.svg'
                  : '/icons/robot.svg'
              }
              alt="Avatar"
              className="chat__avatar"
            />
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={enviarMensagem} className="chat__form">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;
