import supabase from '../lib/supabase'
import { useState } from 'react'

function RegisterPage({ setSite, setUserData }: { setSite: any, setUserData: any }) {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    return (
        <div className='Login-Register'>
            <div className="Form-Holder">
            <h1><img src="/public/favicon.ico" alt="Logo" className='Logo'/>Register</h1>
            <div className="register-form form">
                <label htmlFor="username">Username</label>
                <input id="username" type="text" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="email">Mail</label>
                <input id="email" type="email" placeholder="example@example.com" onChange={(e) => setMail(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
                <div className="Buttons">
                    <button className="Main" onClick={() => handleRegister([mail, password, username, setUserData, setSite])}>Register</button>
                    <button className="No-Button" onClick={() => setSite('login')}>Already have an account? Login</button>
                </div>
            </div>
            </div>
        </div>
    )
}
async function handleRegister([mail, password, username, setUserData, setSite]: [string, string, string, any, any]) {
    const { data, error } = await supabase.auth.signUp({
        email: mail,
        password: password,
    })
    if (error) {
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    } else {
        setUserData(data)
        const {  error } = await supabase.from('users').insert({ username: username, id: data.user?.id, mail: mail })
        if (error) {
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
        } else {
            setSite('dashboard')
            document.querySelector('.popup')!.innerHTML = `<p class="error">${username},Your account has been created successfully!</p>`
        document.querySelector('.popup')!.classList.add('active')
        document.querySelector('.popup')!.classList.add('Positive')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
            document.querySelector('.popup')!.classList.remove('Positive')
        }, 3000)
        }
    }
}
export default RegisterPage