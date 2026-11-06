const User = () => {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Perfil</h1>
        <span className="top-badge">Activo</span>
      </header>

      <section className="user-card">
        <div className="profile-row">
          <div className="avatar">TU</div>
          <div className="user-info">
            <h3>Test User</h3>
            <p>testuser@email.com</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default User;
