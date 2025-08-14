import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './listUsers.css';

function ListUsers() {
    const { Authenticated } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [inicio, setInicio] = useState(0);
    const porPagina = 3; // Mostra 3 cards por vez

    useEffect(() => {
        const fetchUsuarios = async () => {
            if (!Authenticated?.token) return;

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}api/usuarios`, {
                    headers: {
                        Authorization: `Bearer ${Authenticated.token}`
                    }
                });

                const outrosUsuarios = res.data.filter(
                    (user) => user.id !== Authenticated?.id
                );
                setUsuarios(outrosUsuarios);
            } catch (err) {
                console.error('Erro ao buscar usuários:', err);
            }
        };

        fetchUsuarios();
    }, [Authenticated]);

    // Teste sem API
    // const usuariosTeste = [
    //     { photo: '/icons/message.svg', nome: 'User 1', id: 3 },
    //     { photo: '/icons/message.svg', nome: 'User 2', id: 4 },
    //     { photo: '/icons/message.svg', nome: 'User 3', id: 5 },
    //     { photo: '/icons/message.svg', nome: 'User 4', id: 6 },
    //     { photo: '/icons/message.svg', nome: 'User 5', id: 7 },
    // ];

    const usuariosExibidos = usuarios.slice(inicio, inicio + porPagina);

    const anterior = () => {
        setInicio((prev) => Math.max(0, prev - 1));
    };

    const proximo = () => {
        setInicio((prev) => Math.min(usuariosExibidos.length - porPagina, prev + 1));
    };

    return (
        <div className="listar__usuarios__wrapper Section__container">
            <h2 className="section__title">People you can talk to <span>ChatBox</span></h2>
            <div className="carrossel__usuarios">
                <button
                    className="carrossel__btn anterior"
                    onClick={anterior}
                    disabled={inicio === 0}
                >
                    <FaArrowLeft />
                </button>

                <div className="usuarios__lista__wrapper">
                    <div
                        className="usuarios__lista"
                        style={{
                            transform: `translateX(-${inicio * (270 + 16)}px)`,
                        }}
                    >
                        {usuariosExibidos.map((user) => (
                            <div className="usuario__card" key={user.id}>
                                <img
                                    src={user.photo || '/images/default-user.png'}
                                    alt={user.nome}
                                />
                                <span>{user.nome}</span>
                                <a href={`/chat/${user.id}`} className="btn_3">
                                    Send Message
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="carrossel__btn proximo"
                    onClick={proximo}
                    disabled={inicio + porPagina >= usuariosExibidos.length}
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>

    );
}

export default ListUsers;
