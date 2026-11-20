import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Navbar from './Navbar';

const AppShell = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo redirigir cuando ya terminó de verificar el token
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  // Mientras verifica el token, no renderizar nada
  if (loading) return null;
  if (!user) return null;

  return (
    <div className="app-container">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
