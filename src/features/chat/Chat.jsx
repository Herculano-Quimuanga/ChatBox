import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import "./chat.css";
import { FaCheck } from 'react-icons/fa';
import { FaArrowLeft } from "react-icons/fa";

function Chat() {
  const { Authenticated } = useAuth();
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();
  const token = Authenticated?.token;
  const API = import.meta.env.VITE_API_URL;

  const [conversas, setConversas] = useState([]);
  const [conversa, setConversa] = useState([]);
  const [conversaSelecionada, setConversaSelecionada] = useState(null);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(false);

  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [showUsuarios, setShowUsuarios] = useState(false);

  const mensagensRef = useRef(null);
  const typingIntervalRef = useRef(null);

  /* ------------------------------------------------------- USEEFFECTS ------------------------------------------------------ */

  useEffect(() => {
    if (!Authenticated) return;
  }, [Authenticated]);

  useEffect(() => {
    mensagensRef.current?.scrollTo({
      top: mensagensRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversa]);

  useEffect(() => {
    if (!Authenticated) return;
    initChat();
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [Authenticated, paramUserId]);

  // ----------------------------------------------------------------------------------------------

  const initChat = async () => {
    try {
      const res = await axios.get(`${API}api/conversas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const lista = res.data || [];
      setConversas(lista);

      const usersRes = await axios.get(`${API}api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const outrosUsuarios = usersRes.data.filter(u => u.id !== Authenticated.id);
      setTodosUsuarios(outrosUsuarios);

      if (paramUserId) {
        await criarConversaSeNecessario(paramUserId);
        return;
      }

      if (lista.length === 0) {
        const createRes = await axios.post(
          `${API}api/conversas`,
          { eh_ia: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const conversaId = createRes.data.conversaId;
        const convIA = { id: conversaId, eh_ia: true, nome: "ChatBox AI", photo: "/images/favicon.png" };
        setConversas([convIA]);
        await carregarConversa(convIA);
      } else {
        await carregarConversa(lista[0]);
      }

    } catch (err) {
      console.error("Erro ao iniciar Chat:", err.response?.data || err.message);
    }
  };

  const criarConversaSeNecessario = async (param) => {
    let conversaId;
    try {
      setFullLoading(true);
      const numeric = Number(param);
      const isIA = param.toLowerCase?.() === 'ia';

      if (isIA) {
        const res = await axios.post(
          `${API}api/conversas`,
          { eh_ia: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        conversaId = res.data.conversaId;
      } else {
        if (isNaN(numeric)) return navigate("/chat");
        const res = await axios.post(
          `${API}api/conversas`,
          { destinatarioId: numeric, eh_ia: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        conversaId = res.data.conversaId;
      }

      const convRes = await axios.get(`${API}api/conversas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversas(convRes.data || []);
      const convObj = (convRes.data || []).find(c => c.id === conversaId);
      await carregarConversa(convObj);
    }
    catch (err) {
      console.error("Erro criar conversa pela URL:", err);
    }
    finally {
      setFullLoading(false);
    }
  };

  const carregarConversa = async (conversaObj) => {
    if (!conversaObj?.id) return;
    setConversa([]);
    setConversaSelecionada(conversaObj);
    setErro(null);

    try {
      const res = await axios.get(
        `${API}api/conversas/${conversaObj.id}/mensagens`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const msgs = (res.data || []).map(m => ({
        sender: m.sender === 'user' ? 'user' : (conversaObj.eh_ia ? 'ia' : 'outro'),
        text: m.texto,
        remetente_id: m.remetente_id,
        enviada_em: m.enviada_em,
      }));
      setConversa(msgs);

    } catch (err) {
      console.error("Erro ao carregar conversa:", err);
      setErro("Erro ao carregar a conversa.");
    }
  };

  const iniciarNovaConversa = async (destinatarioId) => {
    try {
      setFullLoading(true);
      const res = await axios.post(
        `${API}api/conversas`,
        { destinatarioId, eh_ia: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newId = res.data.conversaId;
      const convRes = await axios.get(`${API}api/conversas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversas(convRes.data || []);
      const newConv = (convRes.data || []).find(c => c.id === newId);
      setShowUsuarios(false);
      await carregarConversa(newConv);
    } catch (err) {
      console.error("Erro ao iniciar conversa:", err);
    } finally {
      setFullLoading(false);
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() || !conversaSelecionada) return;

    const entradaUser = { sender: "user", text: mensagem };

    setConversa(prev => [...prev, entradaUser]);
    setMensagem("");

    // Se for IA, adiciona placeholder e animação
    if (conversaSelecionada.eh_ia) {
      const placeholder = { sender: "ia", text: "Digitando..." };
      setConversa(prev => [...prev, placeholder]);

      setLoading(true);
      let pontos = 1;
      typingIntervalRef.current = setInterval(() => {
        setConversa(prev => {
          const nova = [...prev];
          nova[nova.length - 1].text = "Processando" + ".".repeat(pontos);
          pontos = pontos < 3 ? pontos + 1 : 1;
          return nova;
        });
      }, 400);
    }

    try {
      const res = await axios.post(
        `${API}api/conversas/${conversaSelecionada.id}/mensagens`,
        { texto: mensagem },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Se for IA, substituir o placeholder
      if (conversaSelecionada.eh_ia) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;

        const respostaIA = res.data.ia;
        const nova = respostaIA
          ? { sender: "ia", text: respostaIA }
          : { sender: "ia", text: "..." };

        setConversa(prev => [...prev.slice(0, -1), nova]);
      }

    } catch (err) {
      if (conversaSelecionada.eh_ia) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setConversa(prev => [...prev.slice(0, -1), { sender: "ia", text: "Erro ao enviar." }]);
      }
      console.error("Erro ao enviar:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!Authenticated) return null;

  /* ------ FILTRAR USUÁRIOS QUE AINDA NÃO TÊM CONVERSA -------- */
  const usuariosSemConversa = todosUsuarios.filter(user =>
    !conversas.some(c => !c.eh_ia && c.nome === user.nome)
  );

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="chat__wrapper">
      {fullLoading && (
        <div className="overlay__spinner">
          <span className="loader"></span>
        </div>
      )}

      <aside className="chat__sidebar">
        <h3>Suas conversas</h3>
        {conversas.map((c) => (
          <div
            key={c.id}
            className={`user__card ${conversaSelecionada?.id === c.id ? "active" : ""}`}
            onClick={() => carregarConversa(c)}
          >
            <img src={c.photo} alt={c.nome} />
            <span>{c.nome}</span>
          </div>
        ))}

        <button
          className={`btn_new ${showUsuarios ? 'opened' : ''}`}
          onClick={() => setShowUsuarios((prev) => !prev)}
        >
          {showUsuarios ? "Fechar Lista" : "Novo Chat"}
        </button>

        {showUsuarios && (
          usuariosSemConversa.length > 0 ? (
            usuariosSemConversa.map((u) => (
              <div key={u.id} className="user__card" onClick={() => iniciarNovaConversa(u.id)}>
                <img src={u.photo || '/images/default-user.png'} alt={u.nome} />
                <span>{u.nome}</span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: ".8rem", color: "#555", marginTop: ".5rem" }}>
              Nenhum usuário novo para conversar.
            </p>
          )
        )}
      </aside>

      <div className="chat__container">
        <div className="chat__content">
          <div className="Chat__Header">
            <div className="back__button" onClick={() => navigate("/")}>
              <FaArrowLeft />
            </div>
            <div className="logo">
              <img src="/icons/message.svg" alt="ChatBox Logo" />
              <span>ChatBox</span>
            </div>
          </div>

          {!conversaSelecionada && (
            <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
              Selecione ou inicie uma conversa para começar
            </p>
          )}

          <div className="chat__mensagens" ref={mensagensRef}>
            {conversa.map((msg, i) => {
              const fotoRem =
                msg.sender === "user"
                  ? Authenticated.photo || "/images/default-user.jpg"
                  : conversaSelecionada?.eh_ia
                    ? "/images/favicon.png"
                    : conversaSelecionada?.photo || "/images/default-user.jpg";

              return (
                <div key={i} className={`chat__mensagem ${msg.sender}`}>
                  <img src={fotoRem} alt={msg.sender} className="chat__avatar" />
                  <span className="chat__texto">
                    {msg.text}
                    {msg.sender === "user" && <FaCheck className="chat__check" />}
                  </span>
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
              {(loading && conversaSelecionada?.eh_ia) ? (
                <span className="loader" style={{ width: 22, height: 22, borderWidth: 3 }} />
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
