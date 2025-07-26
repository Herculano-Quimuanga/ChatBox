import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './listUsers.css';

function ListUsers() {
    const { Authenticated } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [inicio, setInicio] = useState(0);
    const porPagina = 4;

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`);
                const outrosUsuarios = res.data.filter((user) => user.id !== Authenticated?.id);
                setUsuarios(outrosUsuarios);
            } catch (err) {
                console.error('Erro ao buscar usuários:', err);
            }
        };

        if (Authenticated) fetchUsuarios();
    }, [Authenticated]);

    const anterior = () => setInicio(Math.max(0, inicio - porPagina));
    const proximo = () => setInicio(Math.min(usuarios.length - porPagina, inicio + porPagina));

    const usuariosExibidos = usuarios.slice(inicio, inicio + porPagina);

    return (
        <div className="listar__usuarios__wrapper">
            <h2>Usuários disponíveis para conversar</h2>
            <div className="carrossel__usuarios">
                <button className="carrossel__btn" onClick={anterior} disabled={inicio === 0}>
                    ◀
                </button>

                <div className="usuarios__lista">
                    {usuariosExibidos.map((user) => (
                        <div className="usuario__card" key={user.id}>
                            <img src={user.photo || '/images/default-user.png'} alt={user.nome} />
                            <span>{user.nome}</span>
                            <a href={`/chat/${user.id}`} className="btn__conversar">
                                Enviar mensagem
                            </a>
                        </div>
                    ))}
                </div>

                <button
                    className="carrossel__btn"
                    onClick={proximo}
                    disabled={inicio + porPagina >= usuarios.length}
                >
                    ▶
                </button>
            </div>
        </div>
    );
}

export default ListUsers;
