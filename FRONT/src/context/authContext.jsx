import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  async function login(email, password) {
    // TODO: descomentar cuando la API esté lista
    // const data = await loginRequest(email, password);
    // setToken(data.token);
    // setUser(data.user);

    // MOCK temporal
    const mockUser = { id: 1, email, username: email.split('@')[0], avatar: email[0].toUpperCase() };
    setUser(mockUser);
    setToken('mock-token-123');
    return mockUser;
  }

  async function register(email, password, username) {
    // TODO: descomentar cuando la API esté lista
    // const data = await registerRequest(email, password, username);
    // setToken(data.token);
    // setUser(data.user);

    // MOCK temporal
    const mockUser = { id: 1, email, username, avatar: username[0].toUpperCase() };
    setUser(mockUser);
    setToken('mock-token-123');
    return mockUser;
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
