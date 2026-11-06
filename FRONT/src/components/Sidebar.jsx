import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <nav>
          <NavLink to="/home/buscador">Buscador</NavLink>
          <NavLink to="/home/favoritos">Favoritos</NavLink>
          <NavLink to="/home/user">Usuario</NavLink>
        </nav>
    )
}

export default Sidebar