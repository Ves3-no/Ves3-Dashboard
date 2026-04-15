import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import { useEffect, useState } from 'react'
import supabase from './lib/supabase'
import { motion } from "motion/react"
function App() {
  const [site, setSite] = useState<any>('login')
  const [userData, setUserData] = useState<any>()
  const [username, setUsername] = useState<any>()
  useEffect(() => {
      async function checkAuth() {
      const {data, error} = await supabase.auth.getSession()
      if (data?.session) {
        setSite('dashboard')
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
  
  const sites: any = {
    'login': <LoginPage setSite={setSite} setUserData={setUserData} username={username} />,
    'register': <RegisterPage setSite={setSite} setUserData={setUserData} />,
    'dashboard': <DashboardPage setSite={setSite} userData={userData} setUsername={setUsername} username={username} />
  }
  return (<>
    <div className='popup'></div>
    <motion.div className="App"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    >
    { site === 'dashboard' && !userData ? sites['login'] : sites[site] }  
    </motion.div>
    <span id='Made-by'>Made by <a href="http://ves3.eu">Ves3</a></span>
    </>)
  
}

export default App
