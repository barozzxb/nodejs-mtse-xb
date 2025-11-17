import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthContext } from './components/context/auth.context'
import axios from './utils/axios.customize.js'
import { Header } from 'antd/es/layout/layout'
import { Spin } from 'antd'

function App() {

  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await axios.get('/user');
      if (res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.email,
            name: res.name,
          }
        })
      }
      setAppLoading(false)
    }
    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading === truem ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%"
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
