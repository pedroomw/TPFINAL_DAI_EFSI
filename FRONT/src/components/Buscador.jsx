import { useState } from 'react';
import Searchbar from './Searchbar';
import Movielist from './Movielist';

const Buscador = () => {
  const [peliculas, setPeliculas] = useState('');

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Descubrí películas</h1>
        <span className="top-badge">Online</span>
      </header>

      <Searchbar setPeliculas={setPeliculas} />
      <Movielist peliculas={peliculas} />
    </>
  );
};

export default Buscador;