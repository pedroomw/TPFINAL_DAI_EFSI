import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/app', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    setError('');
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'register') {
      if (!username.trim()) return setError('El nombre de usuario es obligatorio');
      if (password !== confirmPassword) return setError('Las contraseñas no coinciden');
      if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(email, password, username);
      }
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.message || 'Algo salió mal, intentá de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <span className="brand-icon">🎬</span>
            <span className="brand-name">CineTrack</span>
          </Link>
        </div>
        <div className="auth-left-content">
          <h2>Millones de películas,<br />una sola lista.</h2>
          <p>Organizá lo que querés ver, recordá lo que ya viste y descubrí nuevos títulos.</p>
          <div className="auth-stats">
            <div className="auth-stat">
              <strong>500K+</strong>
              <span>Películas</span>
            </div>
            <div className="auth-stat">
              <strong>Free</strong>
              <span>Para siempre</span>
            </div>
            <div className="auth-stat">
              <strong>24/7</strong>
              <span>Disponible</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >
              Iniciar sesión
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => setTab('register')}
            >
              Registrarse
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="form-group">
                <label>Nombre de usuario</label>
                <input
                  type="text"
                  placeholder="cinefilo123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {tab === 'register' && (
              <div className="form-group">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? 'Cargando...'
                : tab === 'login'
                ? 'Ingresar'
                : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth-switch">
            {tab === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
            <button
              className="auth-switch-btn"
              onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            >
              {tab === 'login' ? 'Registrate' : 'Iniciá sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
