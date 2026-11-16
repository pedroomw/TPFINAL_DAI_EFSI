const Favoritos = () => {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Favoritos</h1>
        <span className="top-badge">Guardados</span>
      </header>

      <section className="favorites-panel">
        <h3>Tu lista</h3>
        <p>Aún no agregaste películas a tus favoritos.</p>

        <div className="fav-list">
          <span className="fav-pill">Drama</span>
          <span className="fav-pill">Acción</span>
          <span className="fav-pill">Ciencia ficción</span>
        </div>
      </section>
    </>
  );
};

export default Favoritos;
