import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/authContext.jsx';

function App() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  return <Outlet />;
}

export default App;
