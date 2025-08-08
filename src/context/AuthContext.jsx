import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [Authenticated, setUsuario] = useState(null);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("usuario");
    if (dadosSalvos) {
      const user = JSON.parse(dadosSalvos);
      if (user.token) {
        setUsuario(user);
      } else {
        console.warn("Token ausente nos dados salvos. Logout automático.");
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  const login = (userData) => {
    if (!userData || !userData.token) {
      console.error("Erro: Token ausente no login");
      return;
    }

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
