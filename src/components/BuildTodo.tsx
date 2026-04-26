import supabase from '../lib/supabase'
import { useEffect,  } from 'react'
function Build({ userData, todo, setTodo, filter }: {userData: any, todo: any, setTodo: any, filter:any}){
    useEffect(() =>{
        if (userData) {
        getTodos(userData, setTodo)
        }
    }, [userData])

    return(<>{todo.map((item: any) => ( 
        <div
        className={`TodoCard`}
        key={item?.id}
        style={{ display: filter === item?.status ? "flex" : filter === "All" ? "flex": "none" }}
        >
            <p onClick={() => changeStatus(item, setTodo ,userData, item.id, todo)} className='Status'>{item.status}</p>
            <div className='TodoCardUnder'>
                <input className='Name' value={item.name} defaultValue={undefined} size={Number(item.name.length)-2} onChange={(e)=> {ChangeName(e.target.value, setTodo ,userData, item.id, todo)}}/>
                <textarea className='Content' value={item.content} defaultValue={undefined} onChange={(e)=> {ChangeContent(e.target.value, setTodo ,userData, item.id, todo)}}> </textarea>
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
        .order('id', { ascending: false })
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
async function changeStatus(item:any, setTodo: any, userData:any, id:any, todo:any){
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
    const ny = todo.map((item:any)=>{
        if(item.id == id){
            return{ ...item, status: NewStatus }
        }
        return item
    })
    setTodo(ny)
}
async function ChangeName(Value:any, setTodo: any, userData:any, id:any, todo:any){
        const {error} = await supabase
        .from('Todo')
        .update({ 'name': Value })
        .eq('id', id)
    if(error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error?.message}!</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    const ny = todo.map((item:any)=>{
        if(item.id == id){
            return{ ...item, name: Value }
        }
        return item
    })
    setTodo(ny)
}
async function ChangeContent(Value:any, setTodo: any, userData:any, id:any, todo:any){
    const {error} = await supabase
        .from('Todo')
        .update({ 'content': Value })
        .eq('id', id)
    if(error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error?.message}!</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    const ny = todo.map((item:any)=>{
        if(item.id == id){
            return{ ...item, content: Value }
        }
        return item
    })
    setTodo(ny)
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