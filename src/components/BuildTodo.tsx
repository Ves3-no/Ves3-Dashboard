import supabase from '../lib/supabase'
import { useEffect } from 'react'
function Build({ userData, todo, setTodo }: {userData: any, todo: any, setTodo: any}){
    useEffect(() =>{
        if (userData) {
        getTodos(userData, setTodo)
        }
    }, [userData])
    return(<>{todo.map((item: any) => (
        <div className='TodoCard' key={item?.name}>
            <p onClick={() => changeStatus(item, setTodo ,userData)} className='Status'>{item.status}</p>
            <div className='TodoCardUnder'>
                <input className='Name' value={item.name} defaultValue={undefined} size={Number(item.name.length)-4}/>
                <textarea className='Content' value={item.content} defaultValue={undefined}> </textarea>
                <button onClick={() => DeleteTodo(item)} className='DeleteBTN'>Burn</button>
            </div>
        </div>
    ))} </>)
}
async function getTodos(userData: any, setTodo:any){
    const User = userData
    const { data, error } = await supabase
        .from("Todo")
        .select()
        .eq('user',  User.user.id)
    if(!error){
        setTodo(data)
    } else{
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error?.message}!</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
}
async function changeStatus(item:any, setTodo: any, userData:any){
    let NewStatus = ""
    if(item.status == "Not Started"){
        NewStatus = "Started"
    } else if(item.status == "Started"){
        NewStatus = "Finished"
    } else if(item.status == "Finished"){
        NewStatus = "Not Started"
    }
    const {error} = await supabase
        .from('Todo')
        .update({ 'status': NewStatus })
        .eq('id', item.id)
    if(error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error?.message}!</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    getTodos(userData, setTodo)
}
async function DeleteTodo(item:any) {
    const {error} = await supabase
        .from('Todo')
        .delete()
        .eq('id', item.id)
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error?.message}!</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
}
export default Build
export { getTodos }