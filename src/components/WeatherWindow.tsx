import { useEffect, useState } from "react"
import { type KeyboardEvent } from 'react'
import supabase from '../lib/supabase'
interface WeatherData {
    main: {
        temp: number
        feels_like: number
    }
    wind:{
        speed: any
    }
    weather: {        
        icon: any
        description: string
    }[]

}
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY 
function WeatherWindow({UserCity, userData, setIsLoading}: {UserCity: any, userData: any, setIsLoading:any}){
    const [City, setCity] = useState<any>()
    const [Weather, setWeather] = useState<WeatherData | null>(null)
    const [Time, setTime] = useState<any>()
    useEffect(()=>{
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, [])
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            UptateUserCity(City, userData)
            GetWeather(City, setWeather, setIsLoading)
        }

    }
    useEffect(()=>{
        function waitForElement(){
                if(typeof UserCity !== "undefined"){
                    setCity(UserCity)
                    setTimeout(()=> {GetWeather(UserCity, setWeather, setIsLoading)}, 10)
                }
                else{
                    setTimeout(waitForElement, 250);
                }
        }
        waitForElement()

    },[UserCity])
    return(
        <>
            <div id="WeatherInputHolder"> 
                <input type="text" onKeyDown={handleKeyDown} onChange={(e)=>{setCity(e.target.value)}} value={City}/>
                <p id="Time">{Time?.toLocaleTimeString()}</p>
            </div>
            <div id="WeatherDisplay">
                <div id="WeatherDisplayMain"> 
                    <img src={`https://openweathermap.org/img/wn/${Weather?.weather?.[0]?.icon}@2x.png`} />
                    <h3 id="Temp">{Weather?.main.temp}°</h3>
                </div>
                <div id="WeatherDisplayInfo">
                    <p id="Feels_like">Føleles som {Weather?.main.feels_like}°</p>
                    <p id="Wind_speed">{Weather?.wind.speed} m/s</p>
                </div>
            </div>
        </>
    )
}
async function GetWeather(City: any, setWeather: any, setIsLoading:any){
    const data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=${API_KEY}&units=metric`
    )
    if(!data.ok){
        const errorData = await data.json()
        document.querySelector('.popup')!.innerHTML = `<p class="error">${errorData.message}, ${data.status}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    } else{
    const WeatherData = await data.json();
    setWeather(WeatherData)
    setTimeout(() => {
        setIsLoading(false)
    }, 1500)

    }


}
async function UptateUserCity(City: any, userData: any){
    const { error } = await supabase
        .from('users')
        .update({ city: City })
        .eq('id', userData.user.id)
        .select()
    if(error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    } 
}   
export default WeatherWindow