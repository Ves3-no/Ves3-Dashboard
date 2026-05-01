import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import { useEffect, useState } from 'react'
import supabase from './lib/supabase'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Alex from './pages/Alex'
import NotFound from './pages/404'
function AppContent({ userData, username, setUserData, setUsername, session, setSession }: { userData: any, username: any, setUserData: any, setUsername: any, session: any, setSession: any }) {
    const navigate = useNavigate()
    useEffect(() => {
      if (!session && window.location.pathname === '/dashboard') {
        navigate('/login')
      }
    }, [session, navigate])
  return (
    <>
    <div className='popup'></div>
      <Routes>
        <Route path="/" element={<LoginPage setUserData={setUserData} username={username} navigate={navigate} session={session} setSession={setSession} />} />
        <Route path="/login" element={<LoginPage setUserData={setUserData} username={username} navigate={navigate} session={session} setSession={setSession} />} />
        <Route path="/register" element={<RegisterPage setUserData={setUserData}  navigate={navigate} setSession={setSession} />} />
        <Route path="/dashboard" element={<DashboardPage  userData={userData} setUsername={setUsername} username={username} navigate={navigate} setSession={setSession} />} />
        <Route path="/alex" element={<Alex />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    <span id='Made-by'>Made by <a href="http://ves3.no">Ves3</a></span>
    </>
    )
  
}
function App() {
    const [userData, setUserData] = useState<any>()
    const [username, setUsername] = useState<any>()
    const [session, setSession] = useState<any>()
    useEffect(() => {
      async function checkAuth() {
      const {data, error} = await supabase.auth.getSession()
      if (data?.session) {
        await getUser()
        setSession(data.session)
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
          console.log(data)
        }
    }
    checkAuth()
    
  }, [])
  return (
    <BrowserRouter>
      <AppContent userData={userData} username={username} setUserData={setUserData} setUsername={setUsername} session={session} setSession={setSession} />
    </BrowserRouter>
  )
}
export default App
