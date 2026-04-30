import Build from './BuildTodo'
import supabase from '../lib/supabase'
import { useState } from 'react'
import send from '../assets/Plus-Symbol-PNG-Images-HD.png'
import { getTodos } from './BuildTodo'
function Todo({ userData, setIsLoading }: { userData: any, setIsLoading: any }){
    const [todo, setTodo] = useState<any>([])
    const [Name, setName] = useState<string>("")
    const [filter, setFilter] = useState<any>("All")
    return(
        <>
            <div id='InputErea'>
                <input type="text" value={Name} onChange={(e)=> setName(e.target.value)} id='TodoInput' name='Input' placeholder='Hva står på agendaen?'/>
                <button onClick={()=> MakeTodo(Name, userData, setTodo, setName, setIsLoading)} id='TodoButton'><img src={send}></img></button>
                <select name="Sort" id="SortTodos" defaultValue={"All"} onChange={(e)=>{HandleSort(e.target.value, setFilter)}}>
                    <option value="All" >All</option>
                    <option value="Not Started">Not Started</option>
                    <option value="Started">Started</option>
                    <option value="Finished">Finished</option>
                </select>
            </div>
            <div id='TodoCards'>
                <Build userData={userData} todo={todo} setTodo={setTodo} filter={filter} setIsLoading={setIsLoading} />
            </div>
        </>
    )
}
function HandleSort(value:any, setFilter:any ){
    setFilter(value)
}
async function MakeTodo(Name: string, userData: any, setTodo:any, setName:any, setIsLoading:any) {
    const User = userData
    setName("")
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
    
    await getTodos(userData, setTodo, setIsLoading)
}
export default Todo
