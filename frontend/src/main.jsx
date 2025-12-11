import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/global.css'
import { ToastContainer } from 'react-toastify';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloProvider } from "@apollo/client/react";

import RegisterPage from './pages/register.jsx';
import LoginPage from './pages/login.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx'
import ProductPage from './pages/product.jsx'
import CartPage from './pages/cart.jsx'
import {client} from './apollo.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "user",
        element: <UserPage />
      },
    ]
  },
  {
    path: 'register',
    element: <RegisterPage />
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: 'products',
    element: <ProductPage />
  },
  {
    path: 'cart',
    element: <CartPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <ApolloProvider client={client}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        <RouterProvider router={router} />
      </ApolloProvider>
    </AuthWrapper>
  </React.StrictMode>,
)
