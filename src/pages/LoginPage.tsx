import { useEffect, useState } from "react"
import supabase from "../lib/supabase"
import logo from "../assets/Ves3.eu med fjell og innsjø.png"

function LoginPage({ setUserData, username, navigate, session, setSession }: { setUserData: any, username: any, navigate: any, session: any, setSession: any }) {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    useEffect(() => {
        if (session) {
            navigate('/dashboard')
        }
    }, [session, navigate])
    useEffect(() => {
        if (session) {
                document.querySelector('.popup')!.innerHTML = `<p class="error">Welcome, back ${username}!</p>`
            document.querySelector('.popup')!.classList.add('active')
            document.querySelector('.popup')!.classList.add('Positive')
            setTimeout(() => {
                document.querySelector('.popup')!.classList.remove('active')
                document.querySelector('.popup')!.classList.remove('Positive')
            }, 3000)
        }
    }, [username])
    return (
        <div className="Login-Register">
            <div className="Form-Holder">
            <h1><img src={logo} className='Logo'/>Login</h1>
            <div className="login-form form">
                <label htmlFor="email">Mail</label>
                <input id="email" type="email" placeholder="example@example.com" onChange={(e) => setMail(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
                <div className="Buttons">
                    <button className="Main" onClick={() => handleLogin([mail, password, navigate, setUserData, setSession])}>Login</button>
                    <button className="Secondary" onClick={() => navigate('/register')}>Dont have an account?</button>
                    <button className="No-Button" onClick={() => navigate('/register')}>Forgot Password?</button>
                </div>
            </div>
            </div>
        </div>
    )
}
async function handleLogin([mail, password, navigate, setUserData, setSession]: [string, string, any, any, any]) {
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
        setSession(data.session)
        navigate('/dashboard')
        
    }
}
export default LoginPage