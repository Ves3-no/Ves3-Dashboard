import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import AiChat from '../components/AiChat'
import logoutIcon from '../assets/logout-icon-lg.png'
import WeatherWindow from '../components/WeatherWindow'
function DashboardPage({ setSite, userData, setUsername, username  }: { setSite: any, userData: any, setUsername: any, username: any }) {
    const [UserCity, setUserCity] = useState<any>()
    useEffect(() => {
        getUser([setUsername, setSite, userData, setUserCity])
    }, [])
    return (
        <div className="DashboardPage">
            <button id="logout-button" onClick={async () => await signOut(setSite)} className='Main'><img src={logoutIcon} alt="Logout"/></button>
            <div id="Dashboard-Content">
                <div id='DB-Left' className='section'>
                    <h1>God dag {username}</h1>
                    <AiChat username={username} />
                </div>
                <div id='DB-Right' >
                    <div id='DB-Right-Top'>
                        <div id='DB-Right-Top-Left' className='section'></div>
                        <div id='DB-Right-Top-Right' className='section'>
                            <WeatherWindow UserCity={UserCity} userData={userData} />
                        </div>
                    </div>
                    <div id='DB-Right-Bottom' className='section'>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
async function getUser([setUsername, setSite, userData, setUserCity ]: [any, any, any, any]) {
    const User = userData
    console.log(userData)
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
        setSite('login')
    } else {
        setUsername(data[0].username)
        setUserCity(data[0].city)
        return data[0]
    }

}
async function signOut(setSite: any) {
    const { error } = await supabase.auth.signOut()
    if (error) {
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    } else {
        setSite('login')
    }
}


export default DashboardPage