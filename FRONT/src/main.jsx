import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx';
import { LibraryProvider } from './context/libraryContext.jsx';
import Landing from './components/Landing.jsx';
import Auth from './components/Auth.jsx';
import AppShell from './components/AppShell.jsx';
import Dashboard from './components/Dashboard.jsx';
import Buscar from './components/Buscar.jsx';
import MiLista from './components/MiLista.jsx';
import Favoritos from './components/Favoritos.jsx';
import Perfil from './components/Perfil.jsx';
import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'buscar', element: <Buscar /> },
      { path: 'lista', element: <MiLista /> },
      { path: 'favoritos', element: <Favoritos /> },
      { path: 'perfil', element: <Perfil /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LibraryProvider>
        <RouterProvider router={router} />
      </LibraryProvider>
    </AuthProvider>
  </React.StrictMode>
);
