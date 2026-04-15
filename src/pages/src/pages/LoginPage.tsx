import { useState } from "react"
import supabase from "../lib/supabase"

function LoginPage({ setSite, setUserData, username }: { setSite: any, setUserData: any, username: any }) {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div className="Login-Register">
            <div className="Form-Holder">
            <h1><img src="./public/favicon.ico" alt="Logo" className='Logo'/>Login</h1>
            <div className="login-form form">
                <label htmlFor="email">Mail</label>
                <input id="email" type="email" placeholder="example@example.com" onChange={(e) => setMail(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
                <div className="Buttons">
                    <button className="Main" onClick={() => handleLogin([mail, password, setSite, setUserData, username])}>Login</button>
                    <button className="Secondary" onClick={() => setSite('register')}>Dont have an account?</button>
                    <button className="No-Button" onClick={() => setSite('register')}>Forgot Password?</button>
                </div>
            </div>
            </div>
        </div>
    )
}
async function handleLogin([mail, password, setSite, setUserData, username]: [string, string, any, any, any]) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: mail,
        password: password,
    })
    if (error) {
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    } else  {
        setUserData(data)
        setSite('dashboard')
        await username 
        document.querySelector('.popup')!.innerHTML = `<p class="error">Welcome, back ${username}!</p>`
        document.querySelector('.popup')!.classList.add('active')
        document.querySelector('.popup')!.classList.add('Positive')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
            document.querySelector('.popup')!.classList.remove('Positive')
        }, 3000)
    }
}
export default LoginPage