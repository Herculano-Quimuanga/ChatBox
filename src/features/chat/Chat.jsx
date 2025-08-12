import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import "./chat.css";
import { FaCheck } from 'react-icons/fa';

function Chat() {
  const { Authenticated } = useAuth();
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();
  const token = Authenticated?.token;

  const [conversas, setConversas] = useState([]);
  const [conversa, setConversa] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const mensagensRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!Authenticated) return;
    console.log("Autenticado:", Authenticated);
    // redireciona se deslogado
  }, [Authenticated, navigate]);

  // Scroll quando conversa mudar
  useEffect(() => {
    mensagensRef.current?.scrollTo({
      top: mensagensRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversa]);

  // Inicialização: carrega conversas e abre conforme param / regra
  useEffect(() => {
    if (!Authenticated) return;

    const init = async () => {
      try {
        // 1) carrega todas as conversas do utilizador
        const res = await axios.get(`${API}/api/conversas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lista = res.data || [];
        setConversas(lista);

        // 2) se existe param userId → cria/obtém a conversa com esse user
        if (paramUserId) {
          // se o param for 'ia' (string) consideramos conversa IA — caso contrário assumimos número
          const isIAParam = paramUserId.toLowerCase?.() === "ia";
          if (isIAParam) {
            // cria/obtém conversa IA
            const createRes = await axios.post(
              `${API}/api/conversas`,
              { eh_ia: true },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const conversaId = createRes.data.conversaId;
            // recarrega lista para atualizar nome/photo
            const res2 = await axios.get(`${API}/api/conversas`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setConversas(res2.data || []);
            const convObj =
              (res2.data || []).find((c) => c.id === conversaId) || {
                id: conversaId,
                eh_ia: true,
                nome: "ChatBox AI",
                photo: "/images/favicon.png",
              };
            await carregarConversa(convObj);
          } else {
            // param numerico -> conversa entre users
            const destinatarioId = Number(paramUserId);
            if (Number.isNaN(destinatarioId)) {
              console.warn("userId inválido na URL:", paramUserId);
              navigate("/chat");
              return;
            }
            // cria/obtém conversa entre users
            const createRes = await axios.post(
              `${API}/api/conversas`,
              { destinatarioId, eh_ia: false },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const conversaId = createRes.data.conversaId;
            // atualizar lista e selecionar a conversa criada
            const res2 = await axios.get(`${API}/api/conversas`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setConversas(res2.data || []);
            const convObj =
              (res2.data || []).find((c) => c.id === conversaId) || {
                id: conversaId,
                eh_ia: false,
                nome: "Usuário",
                photo: "/images/default-user.jpg",
              };
            await carregarConversa(convObj);
          }
          return;
        }

        // 3) sem param: se lista vazia -> cria conversa IA; se não, seleciona a primeira
        if ((lista || []).length === 0) {
          const createRes = await axios.post(
            `${API}/api/conversas`,
            { eh_ia: true },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const conversaId = createRes.data.conversaId;
          const res2 = await axios.get(`${API}/api/conversas`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setConversas(res2.data || []);
          const convObj =
            (res2.data || []).find((c) => c.id === conversaId) || {
              id: conversaId,
              eh_ia: true,
              nome: "ChatBox AI",
              photo: "/images/favicon.png",
            };
          carregarConversa(convObj);
        } else {
          carregarConversa(lista[0]);
        }
      } catch (err) {
        console.error("Erro init chat:", err.response?.data || err.message);
      }
    };

    init();

    // cleanup do interval se desmoutar
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [Authenticated, paramUserId]);

  // Função para carregar mensagens de uma conversa (por objecto converse)
  const carregarConversa = async (conversaObj) => {
    if (!conversaObj || !conversaObj.id) return;
    setErro(null);
    setConversa([]);
    setConversaSelecionada(conversaObj);

    try {
      const res = await axios.get(
        `${API}/api/conversas/${conversaObj.id}/mensagens`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // API devolve { sender: 'user' | 'outro', texto, ... }
      const msgs = (res.data || []).map((m) => ({
        sender: m.sender === "user" ? "user" : conversaObj.eh_ia ? "ia" : "outro",
        text: m.texto || m.text || "",
        remetente_id: m.remetente_id,
        enviada_em: m.enviada_em,
      }));
      setConversa(msgs);
    } catch (err) {
      console.error("Erro ao carregar conversa:", err.response?.data || err.message);
      setErro("Erro ao carregar a conversa.");
    }
  };

  // Enviar mensagem
  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() || loading) return;
    if (!conversaSelecionada) {
      setErro("Selecione uma conversa primeiro.");
      return;
    }

    const entradaUser = { sender: "user", text: mensagem };
    const placeholder = { sender: conversaSelecionada.eh_ia ? "ia" : "outro", text: "Digitando..." };
    setConversa((prev) => [...prev, entradaUser, placeholder]);
    setMensagem("");
    setErro(null);
    setLoading(true);

    // typing animation
    let pontos = 1;
    typingIntervalRef.current = setInterval(() => {
      setConversa((prev) => {
        const nova = [...prev];
        nova[nova.length - 1].text = "Processando" + ".".repeat(pontos);
        pontos = pontos < 3 ? pontos + 1 : 1;
        return nova;
      });
    }, 400);

    try {
      const res = await axios.post(
        `${API}/api/conversas/${conversaSelecionada.id}/mensagens`,
        { texto: mensagem },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      const respostaIA = res.data.ia;
      const novaMensagem = respostaIA
        ? { sender: "ia", text: respostaIA }
        : { sender: "outro", text: "" };

      setConversa((prev) => [...prev.slice(0, -1), novaMensagem]);
    } catch (err) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      setErro("Erro ao enviar a mensagem.");
      setConversa((prev) => [...prev.slice(0, -1), { sender: "ia", text: "Erro ao enviar." }]);
      console.error("Erro enviar mensagem:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!Authenticated) return null;

  return (
    <div className="chat__wrapper">
      <aside className="chat__sidebar">
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
      </aside>

      <div className="chat__container">
        <div className="chat__content">
          <div className="Chat__Header">
            <div className="logo" onClick={() => navigate("/")}>
              <img src="/icons/message.svg" alt="ChatBox Logo" />
              <span>ChatBox</span>
            </div>
          </div>

          {!conversaSelecionada && (
            <p style={{ color: "red", marginTop: "1rem" }}>
              Selecione uma conversa para começar a enviar mensagens.
            </p>
          )}

          <div className="chat__mensagens" ref={mensagensRef}>
            {conversa.map((msg, i) => {
              const fotoRemetente =
                msg.sender === "user"
                  ? Authenticated.photo || "/images/default-user.jpg"
                  : conversaSelecionada?.eh_ia
                    ? "/images/favicon.png"
                    : conversaSelecionada?.photo || "/images/default-user.jpg";

              return (
                <div key={i} className={`chat__mensagem ${msg.sender}`}>
                  <img src={fotoRemetente} alt={msg.sender} className="chat__avatar" />

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
              {loading ? <span className="loader" /> : <img src="/icons/send.svg" alt="Enviar" className="send__icon" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
