import { createContext, useContext, useEffect, useState } from "react";
import {
  getCsrfCookie,
  loginRequest,
  meRequest,
  logoutRequest,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await meRequest();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    await getCsrfCookie();
    await loginRequest(email, password);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Errore logout:", error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: !!user?.is_admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}