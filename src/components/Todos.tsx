import Build from './BuildTodo'
import supabase from '../lib/supabase'
import { useState } from 'react'
import send from '../assets/Plus-Symbol-PNG-Images-HD.png'
import { getTodos } from './BuildTodo'
function Todo({ userData }: any){
    const [todo, setTodo] = useState<any>([])
    const [Name, setName] = useState<string>("")
    return(
        <>
            <div id='InputErea'>
                <input type="text" value={Name} onChange={(e)=> setName(e.target.value)} id='TodoInput' name='Input'/>
                <button onClick={()=> MakeTodo(Name, userData, setTodo)} id='TodoButton'><img src={send}></img></button>
            </div>
            <div id='TodoCards'>
                <Build userData={userData} todo={todo} setTodo={setTodo}/>
            </div>
        </>
    )
}
async function MakeTodo(Name: string, userData: any, setTodo:any){
    const User = userData
    
    const { error } = await supabase
        .from('Todo')
        .insert({ 'name': Name, 'user': User.user.id, 'status': "Not Started" })
        if(error){
            document.querySelector('.popup')!.innerHTML = `<p class="error">${error?.message}!</p>`
            document.querySelector('.popup')!.classList.add('active')
            setTimeout(() => {
                document.querySelector('.popup')!.classList.remove('active')
            }, 3000)
        }
        getTodos(userData, setTodo)
}
export default Todo
