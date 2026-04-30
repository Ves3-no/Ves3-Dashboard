import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import { useEffect, useState } from 'react'
import supabase from './lib/supabase'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
function AppContent() {
  const [userData, setUserData] = useState<any>()
  const [username, setUsername] = useState<any>()
  const navigate = useNavigate()
  useEffect(() => {
      async function checkAuth() {
      const {data, error} = await supabase.auth.getSession()
      if (data?.session) {
        navigate('/dashboard')
        await getUser()
      } else if (error) {
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
      }
    }
    async function getUser() {     
        const { data, error } = await supabase.auth.getUser()
        if (error) {
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
        } else {
          setUserData(data)
        }
    }
    checkAuth()
    
  }, [])
  
  return (
    <>
    <div className='popup'></div>
      <Routes>
        <Route path="/" element={<LoginPage setUserData={setUserData} username={username} navigate={navigate} />} />
        <Route path="/login" element={<LoginPage setUserData={setUserData} username={username} navigate={navigate} />} />
        <Route path="/register" element={<RegisterPage setUserData={setUserData}  navigate={navigate}/>} />
        <Route path="/dashboard" element={<DashboardPage  userData={userData} setUsername={setUsername} username={username} navigate={navigate} />} />
      </Routes>
    <span id='Made-by'>Made by <a href="http://ves3.no">Ves3</a></span>
    </>
    )
  
}
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
export default App
