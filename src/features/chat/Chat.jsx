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

  // Carrega histórico
  useEffect(() => {
    if (!Authenticated) {
      navigate('/login');
      return;
    }

    const fetchHistorico = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chat/${Authenticated.id}`
        );
        setConversa(res.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar o histórico.');
      }
    };

    fetchHistorico();
  }, [Authenticated, navigate]);

  // Scroll automático
  useEffect(() => {
    mensagensRef.current?.scrollTo({
      top: mensagensRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [conversa]);

  const getUserInitial = () => {
    return Authenticated?.nome
      ? Authenticated.nome.charAt(0).toUpperCase()
      : 'U';
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() || loading) return;

    // Adiciona mensagem do usuário e placeholder IA
    const novaEntrada = { sender: 'user', text: mensagem };
    const placeholder = { sender: 'ia', text: 'IA está digitando...' };
    setConversa((prev) => [...prev, novaEntrada, placeholder]);
    setMensagem('');
    setErro(null);
    setLoading(true);

    let pontos = 1;
    const intervalo = setInterval(() => {
      setConversa((prev) => {
        const nova = [...prev];
        nova[nova.length - 1].text = 'Processando resposta' + '.'.repeat(pontos);
        pontos = pontos < 3 ? pontos + 1 : 1;
        return nova;
      });
    }, 500);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          user_id: Authenticated.id,
          mensagem
        },
        { withCredentials: false }
      );

      clearInterval(intervalo);
      setConversa((prev) => {
        const semPlaceholder = prev.slice(0, -1);
        return [...semPlaceholder, { sender: 'ia', text: res.data.resposta }];
      });
    } catch (err) {
      clearInterval(intervalo);
      console.error(err);
      setErro('Erro ao obter resposta da IA.');
      setConversa((prev) => [
        ...prev.slice(0, -1),
        { sender: 'ia', text: 'Não foi possível processar a resposta. Tente mais tarde!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!Authenticated) return null;

  return (
    <div className="chat__container Section__container">
      <div className="chat__content">
        <div className="Chat__Header">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="icons/message.svg" alt="ChatBox Logo" />
            <span>ChatBox</span>
          </div>
        </div>

        <div className="chat__mensagens" ref={mensagensRef}>
          {conversa.map((msg, index) => {
            let userAvatar;
            if (msg.sender === 'user') {
              userAvatar = Authenticated.photo ? (
                <img src={Authenticated.photo} alt="Avatar" className="chat__avatar" />
              ) : (
                <span className="Logo__Letter">{getUserInitial()}</span>
              );
            } else {
              userAvatar = (
                <img src="/images/favicon.png" alt="IA" className="chat__avatar" />
              );
            }
            return (
              <div key={index} className={`chat__mensagem ${msg.sender}`}>
                {userAvatar}
                <span>{msg.text}</span>
              </div>
            );
          })}
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
          <button type="submit" disabled={loading || !mensagem.trim()}>
            {loading ? (
              <span className="loader"></span>
            ) : (
              <img src="/icons/send.svg" alt="Enviar" className="send__icon" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;