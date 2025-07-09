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
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const mensagensRef = useRef(null);

  useEffect(() => {
    if (!Authenticated) {
      navigate('/login');
      return;
    }

    const fetchHistorico = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/${Authenticated.id}`);
        setConversa(res.data);
      } catch (err) {
        setErro('Erro ao carregar o histórico.');
        console.error(err);
      }
    };

    fetchHistorico();
  }, [Authenticated, navigate]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [conversa, loading]);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() || !Authenticated) return;

    const novaEntrada = { sender: 'user', text: mensagem };
    setConversa((prev) => [...prev, novaEntrada]);
    setMensagem('');
    setErro(null);
    setLoading(true);

    // Exibe "esperando..." temporariamente
    setConversa((prev) => [...prev, { sender: 'ia', text: 'Esperando' }]);
    let pontos = 1;
    const intervalo = setInterval(() => {
      setConversa((prev) => {
        const novaConversa = [...prev];
        novaConversa[novaConversa.length - 1].text = 'Esperando' + '.'.repeat(pontos);
        pontos = pontos < 3 ? pontos + 1 : 1;
        return novaConversa;
      });
    }, 500);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        user_id: Authenticated.id,
        mensagem,
      });

      clearInterval(intervalo);
      const novaConversa = [...conversa];
      novaConversa.pop(); // remove "esperando..."
      setConversa([
        ...novaConversa,
        novaEntrada,
        { sender: 'ia', text: res.data.resposta }
      ]);
    } catch (err) {
      clearInterval(intervalo);
      console.error('Erro ao enviar mensagem:', err);
      setErro('Ocorreu um erro ao obter resposta da IA.');
      setConversa((prev) => [...prev.slice(0, -1), { sender: 'ia', text: '[Erro ao obter resposta da IA]' }]);
    } finally {
      setLoading(false);
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
        {erro && <div className="chat__erro">⚠️ {erro}</div>}
      </div>

      <form onSubmit={enviarMensagem} className="chat__form">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default Chat;
