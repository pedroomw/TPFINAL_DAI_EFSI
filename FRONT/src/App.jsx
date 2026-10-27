import { useState, useEffect} from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import {useAuth} from './context/authContext.jsx'

function App() {

  const navigate = useNavigate('')
  const {user} = useAuth()

 useEffect(() => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  }, [user]);
  return (
    <>
    <h1>{user}</h1>
      <Outlet></Outlet>
    </>
  )
}

export default App
