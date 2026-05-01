import { useEffect, useRef, useState } from 'react'
import supabase from '../lib/supabase'
import AiChat from '../components/AiChat'
import logoutIcon from '../assets/logout-icon-lg.png'
import WeatherWindow from '../components/WeatherWindow'
import loadingImg from '../assets/146-loading.png'
import Todo from '../components/Todos'
function DashboardPage({ userData, setUsername, username , navigate, setSession}: { userData: any, setUsername: any, username: any, navigate: any, setSession: any }) {
    const [UserCity, setUserCity] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const loadingScreen = useRef<HTMLDivElement>(null);
    useEffect(() => {
        getUser([setUsername, navigate, userData, setUserCity])
    }, [userData])
    useEffect(()=> {
        const loading = loadingScreen.current
        if(isLoading == true){
            loading?.classList.add("active")
        } else {
            loading?.classList.remove("active")
        }
    }, [isLoading])
    
    return (
        <>
        <div id='Loading' ref={loadingScreen}><img src={loadingImg} alt="Loading..." /></div>
        <div className="DashboardPage">
            <button id="logout-button" onClick={async () => await signOut(navigate, setSession)} className='Main'><img src={logoutIcon} alt="Logout"/></button>
            <div id="Dashboard-Content">
                <div id='DB-Left' className='section'>
                    <h1>God dag {username}</h1>
                    <AiChat username={username} />
                </div>
                <div id='DB-Right' >
                    <div id='DB-Right-Top'>
                        <div id='DB-Right-Top-Left' className='section Soon' >
                            <Todo userData={userData}/>
                        </div>
                        <div id='DB-Right-Top-Right' className='section'>
                            <WeatherWindow UserCity={UserCity} userData={userData} setIsLoading={setIsLoading} />
                        </div>
                    </div>
                    <div id='DB-Right-Bottom' className='section Soon'>
                        Coming soon
                    </div>
                </div>
            </div>
        </div>
        </>
    )
    
}
async function getUser([setUsername, navigate, userData, setUserCity, ]: [any, any, any, any]) {
    const User = userData
    if (!User) return null
    const { data, error} = await supabase
        .from('users')
        .select('username, city')
        .eq('id', User.user.id)
    if (error) {
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)

        navigate('/login')
    } else {
        setUsername(data[0].username)
        setUserCity(data[0].city)
        return data[0]
    }

}
async function signOut(navigate: any, setSession: any) {
    const { error } = await supabase.auth.signOut()
    if (error) {
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    } else {
        setSession(null)
        navigate('/login')
    }
}


export default DashboardPage