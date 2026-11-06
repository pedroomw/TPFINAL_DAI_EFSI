import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Home = () => {
  return (
    <div className="page-shell">
      <div className="app-shell">
        <Sidebar />
        <main className="content-panel">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;