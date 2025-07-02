import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [Authenticated, setUsuario] = useState(null);

    useEffect(() => {
        const dadosSalvos = localStorage.getItem("usuario");
        if (dadosSalvos) {
            setUsuario(JSON.parse(dadosSalvos));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("usuario", JSON.stringify(userData));
        setUsuario(userData);
    };

    const logout = () => {
        localStorage.removeItem("usuario");
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ Authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
