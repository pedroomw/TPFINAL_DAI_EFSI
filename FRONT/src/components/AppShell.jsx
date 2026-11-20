import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Navbar from './Navbar';

const AppShell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [lastQuery, setLastQuery] = useState('');

  useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSearchResults = (results, query) => {
    setSearchResults(results);
    setLastQuery(query);
  };

  if (!user) return null;

  return (
    <div className="app-container">
      <Navbar onSearchResults={handleSearchResults} />
      <main className="app-main">
        <Outlet context={{ searchResults, lastQuery }} />
      </main>
    </div>
  );
};

export default AppShell;
