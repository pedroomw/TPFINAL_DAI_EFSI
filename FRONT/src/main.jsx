import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx';
import App from './App.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Buscador from './components/Buscador.jsx';
import Favoritos from './components/Favoritos.jsx';
import User from './components/User.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'auth',
        element: <Login />
      },
      {
        path: 'home',
        element: <Home />,
        children: [
          {
            index: true,
            element: <Buscador />
          },
          {
            path: 'buscador',
            element: <Buscador />
          },
          {
            path: 'favoritos',
            element: <Favoritos />
          },
          {
            path: 'user',
            element: <User />
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);