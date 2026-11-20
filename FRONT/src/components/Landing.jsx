import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🔍',
    title: 'Buscá cualquier película',
    desc: 'Accedé a millones de títulos con información detallada al instante.',
  },
  {
    icon: '📋',
    title: 'Tu lista personalizada',
    desc: 'Guardá lo que querés ver y marcá lo que ya viste.',
  },
  {
    icon: '❤️',
    title: 'Favoritos siempre a mano',
    desc: 'Organizá tus películas favoritas en un solo lugar.',
  },
  {
    icon: '📊',
    title: 'Estadísticas de tu historial',
    desc: 'Mirá cuánto tiempo de cine llevas acumulado.',
  },
];

// Posters via TMDB image CDN (libre de hotlinking, no requiere API key)
const POPULAR = [
  { title: 'Interstellar', year: '2014', poster: 'https://image.tmdb.org/t/p/w300/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg' },
  { title: 'The Dark Knight', year: '2008', poster: 'https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { title: 'Inception', year: '2010', poster: 'https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  { title: 'The Godfather', year: '1972', poster: 'https://image.tmdb.org/t/p/w300/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg' },
  { title: 'Pulp Fiction', year: '1994', poster: 'https://image.tmdb.org/t/p/w300/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
];

const Landing = () => {
  return (
    <div className="landing">
      {/* NAV */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <span className="brand-icon">🎬</span>
          <span className="brand-name">CineTrack</span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/auth" className="nav-login-btn">Iniciar sesión</Link>
          <Link to="/auth?tab=register" className="nav-register-btn">Registrarse</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ Tu tracker de cine personal</div>
          <h1 className="hero-title">
            Organizá tu vida<br />
            <span className="hero-gradient">cinematográfica</span>
          </h1>
          <p className="hero-subtitle">
            Buscá películas, armá tu lista de pendientes, marcá las que ya viste
            y guardá tus favoritas. Todo en un solo lugar.
          </p>
          <div className="hero-cta">
            <Link to="/auth?tab=register" className="cta-primary">
              Empezar gratis
            </Link>
            <Link to="/auth" className="cta-secondary">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="hero-posters">
          {POPULAR.map((m, i) => (
            <div
              key={m.title}
              className="hero-poster-card"
              style={{ '--i': i }}
            >
              <img
                src={m.poster}
                alt={m.title}
                onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.background = 'rgba(17,24,39,0.9)'; }}
              />
              <div className="hero-poster-info">
                <span>{m.title}</span>
                <span>{m.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2 className="features-title">Todo lo que necesitás</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="landing-cta-bottom">
        <h2>¿Listo para organizar tu cine?</h2>
        <p>Crear una cuenta es gratis y lleva menos de un minuto.</p>
        <Link to="/auth?tab=register" className="cta-primary">
          Crear cuenta gratis
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <span>🎬 CineTrack</span>
        <span>Trabajo Práctico Final — DAI EFSI</span>
      </footer>
    </div>
  );
};

export default Landing;
