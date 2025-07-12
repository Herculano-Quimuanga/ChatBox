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
        console.error(err);
        setErro('Erro ao carregar o histórico.');
      }
    };

    fetchHistorico();
  }, [Authenticated, navigate]);

  useEffect(() => {
    mensagensRef.current?.scrollTo({ top: mensagensRef.current.scrollHeight, behavior: 'smooth' });
  }, [conversa, loading]);

  const getUserInitial = () => {
    return Authenticated?.nome ? Authenticated.nome.charAt(0).toUpperCase() : 'U';
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() || loading) return;

    const novaEntrada = { sender: 'user', text: mensagem };
    const placeholder = { sender: 'ia', text: 'IA está digitando' };
    setConversa((prev) => [...prev, novaEntrada, placeholder]);
    setMensagem('');
    setErro(null);
    setLoading(true);

    let pontos = 1;
    const intervalo = setInterval(() => {
      setConversa((prev) => {
        const nova = [...prev];
        nova[nova.length - 1].text = 'IA está digitando' + '.'.repeat(pontos);
        pontos = pontos < 3 ? pontos + 1 : 1;
        return nova;
      });
    }, 500);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        user_id: Authenticated.id,
        mensagem,
      });

      clearInterval(intervalo);
      setConversa((prev) => {
        const semPlaceholder = prev.slice(0, -1);
        return [...semPlaceholder, { sender: 'ia', text: res.data.resposta }];
      });
    } catch (err) {
      clearInterval(intervalo);
      console.error(err);
      setErro('Erro ao obter resposta da IA.');
      setConversa((prev) => [...prev.slice(0, -1), { sender: 'ia', text: '[Erro ao responder]' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!Authenticated) return null;

  return (
    <div className="chat__container Section__container">

      <div className="chat__mensagens" ref={mensagensRef}>
        {conversa.map((msg, index) => (
          <div key={index} className={`chat__mensagem ${msg.sender}`}>
            {msg.sender === 'user' ? (
              Authenticated.photo ? (
                <img src={Authenticated.photo} alt="Avatar" className="chat__avatar" />
              ) : (
                <span className="Logo__Letter">{getUserInitial()}</span>
              )
            ) : (
              <img src="/images/favicon.png" alt="IA" className="chat__avatar" />
            )}
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
        <button type="submit" disabled={loading || !mensagem.trim()}>
          {loading ? 'Enviando...' : <img src="/icons/send.svg" alt="Enviar" className="send__icon" />}
        </button>
      </form>
    </div>
  );
}

export default Chat;
