import { useState } from 'react';
import { buscarPelícula } from '../services/omdbService';

const Searchbar = ({ setPeliculas }) => {
  const [nombre, setNombre] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const respuesta = await buscarPelícula(nombre);
    setPeliculas(respuesta);
  };

  return (
    <section className="search-panel">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-input"
          type="text"
          placeholder="Buscar película, serie o título..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button className="primary-btn" type="submit">
          Buscar
        </button>
      </form>
    </section>
  );
};

export default Searchbar;