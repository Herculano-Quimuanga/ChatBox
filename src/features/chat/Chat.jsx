import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './chat.css';

function Chat() {
  const { Authenticated } = useAuth();
  const navigate = useNavigate();

  const [conversas, setConversas] = useState([]);
  const [conversa, setConversa] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const mensagensRef = useRef(null);

  // Carrega as conversas existentes
  useEffect(() => {
    if (!Authenticated) return;

    const fetchConversas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversas`, {
          headers: {
            Authorization: `Bearer ${Authenticated.token}`
          }
        });
        setConversas(res.data);
      } catch (err) {
        console.error('Erro ao buscar conversas:', err);
      }
    };

    fetchConversas();
  }, [Authenticated]);

  useEffect(() => {
    if (!Authenticated) navigate('/login');
  }, [Authenticated, navigate]);

  useEffect(() => {
    mensagensRef.current?.scrollTo({ top: mensagensRef.current.scrollHeight, behavior: 'smooth' });
  }, [conversa]);

  //  Carrega as mensagens de uma conversa
  const carregarConversa = async (conversaObj) => {
    if (!conversaObj) return;
    setErro(null);
    setConversa([]);
    setConversaSelecionada(conversaObj);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/conversas/${conversaObj.id}/mensagens`,
        {
          headers: {
            Authorization: `Bearer ${Authenticated.token}`
          }
        }
      );
      setConversa(res.data || []);
    } catch (err) {
      console.error(err);
      setErro('Erro ao carregar a conversa.');
    }
  };

  //  Envia mensagem para o backend
  const enviarMensagem = async (e) => {
    e.preventDefault();
    console.log('Tentando enviar:', mensagem);
    console.log('Conversa selecionada:', conversaSelecionada);
    console.log('Token:', Authenticated?.token);

    if (!mensagem.trim() || loading || !conversaSelecionada) return;

    const entradaUser = { sender: 'user', text: mensagem };
    const placeholder = { sender: 'ia', text: 'Digitando...' };
    setConversa((prev) => [...prev, entradaUser, placeholder]);
    setMensagem('');
    setErro(null);
    setLoading(true);

    let pontos = 1;
    const intervalo = setInterval(() => {
      setConversa((prev) => {
        const nova = [...prev];
        nova[nova.length - 1].text = 'Processando' + '.'.repeat(pontos);
        pontos = pontos < 3 ? pontos + 1 : 1;
        return nova;
      });
    }, 400);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/conversas/${conversaSelecionada.id}/mensagens`,
        { texto: mensagem },
        {
          headers: {
            Authorization: `Bearer ${Authenticated?.token}`
          }
        }
      );

      clearInterval(intervalo);
      const respostaIA = res.data.ia;
      const novaMensagem = respostaIA
        ? { sender: 'ia', text: respostaIA }
        : { sender: 'outro', text: 'Mensagem enviada com sucesso!' };

      setConversa((prev) => [...prev.slice(0, -1), novaMensagem]);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      clearInterval(intervalo);
      setErro('Erro ao enviar a mensagem.');
      setConversa((prev) => [...prev.slice(0, -1), { sender: 'ia', text: 'Erro ao enviar.' }]);
      console.error('Erro detalhado:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!Authenticated) return null;

  return (
    <div className="chat__wrapper">
      <aside className="chat__sidebar">
        {conversas.map((c) => (
          <div key={c.id} className="user__card" onClick={() => carregarConversa(c)}>
            <img src={c.photo} alt={c.nome} />
            <span>{c.nome}</span>
          </div>
        ))}
      </aside>

      <div className="chat__container">
        <div className="chat__content">
          <div className="Chat__Header">
            <div className="logo" onClick={() => navigate('/')}>
              <img src="/icons/message.svg" alt="ChatBox Logo" />
              <span>ChatBox</span>
            </div>
          </div>

          {!conversaSelecionada && (
            <p style={{ color: 'red', marginTop: '1rem' }}>
              Selecione uma conversa para começar a enviar mensagens.
            </p>
          )}

          <div className="chat__mensagens" ref={mensagensRef}>
            {conversa.map((msg, i) => (
              <div key={i} className={`chat__mensagem ${msg.sender}`}>
                {msg.sender === 'user' ? (
                  <img src={Authenticated.photo} alt="eu" className="chat__avatar" />
                ) : (
                  <img
                    src={conversaSelecionada?.eh_ia ? '/images/favicon.png' : conversaSelecionada?.photo}
                    alt={msg.sender}
                    className="chat__avatar"
                  />
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
              {loading ? (
                <span className="loader" />
              ) : (
                <img src="/icons/send.svg" alt="Enviar" className="send__icon" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
