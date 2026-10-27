import { useState, useEffect} from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

function App() {


  const navigate = useNavigate('')
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  }, [isAuthenticated]);
  return (
    <>
      <button onClick={() => setIsAuthenticated(!isAuthenticated)}>Autenticarme</button>
      <Outlet></Outlet>
    </>
  )
}

export default App
