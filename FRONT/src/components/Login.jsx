import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await auth.login(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Ingresá tus datos para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-group">
            Email
            <input
              className="login-input"
              type="email"
              value={email}
              placeholder="usuario@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="input-group">
            Contraseña
            <input
              className="login-input"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <p className="error-message">{error}</p>

          <button className="login-submit" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
