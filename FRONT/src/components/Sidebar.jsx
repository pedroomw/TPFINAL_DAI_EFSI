import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS file for styling

const Sidebar = () => {
  const navItems = [
    { to: '/home/buscador', label: 'Buscador' },
    { to: '/home/favoritos', label: 'Favoritos' },
    { to: '/home/user', label: 'Usuario' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-mark">M</div>
        <div className="brand-text">MovieApp</div>
      </div>

      <nav className="nav-menu" aria-label="Menú principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-dot" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;