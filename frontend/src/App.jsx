import { useContext, useEffect, useState } from 'react'
import './App.css'
import { AuthContext } from './components/context/auth.context'
import axios from './utils/axios.customize.js'
import Header from './components/layout/headers.jsx'
import { Spin } from 'antd'
import { Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function App() {

  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setAppLoading(true);
        const token = localStorage.getItem('access_token');
        if (!token) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          return Promise.reject(new Error('No token'));
        }

        const isTokenExpired = (token) => {
          try {
            if (!token) return true;
            const decoded = jwtDecode(token);
            if (!decoded?.exp) return true;
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
          } catch (err) {
            return true;
          }
        };

        if (isTokenExpired(token)) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
        
        const res = await axios.get('/api/v1/user');
        if (res && !res.message) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.data.email,
              name: res.data.name,
            }
          });
        }
      } catch (error) {
        setAuth({
          isAuthenticated: false,
          user: null
        });
      } finally {
        setAppLoading(false);
      }
    }
    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Spin />
        </div>
        :
        <>
          <Header />
          <Outlet />
        </>}
    </div>
  )
}

export default App
