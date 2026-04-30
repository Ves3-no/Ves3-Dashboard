import supabase from '../lib/supabase'
import { useEffect, useState,  } from 'react'
function Build({ userData, todo, setTodo, filter, setIsLoading }: {userData: any, todo: any, setTodo: any, filter:any, setIsLoading: any}){
    const [Notes, setNotes] = useState<any>()
    useEffect(() =>{
        if (userData) {
        getTodos(userData, setTodo, setIsLoading)
        }
    }, [userData])

    return(<>{todo.map((item: any) => ( 
        <div
        className={`TodoCard`}
        key={item?.id}
        style={{ display: filter === item?.status ? "flex" : filter === "All" ? "flex": "none" }}
        >
            <p onClick={() => changeStatus(item, setTodo , item.id, todo)} className='Status' data-status={item.status}>{item.status}</p>
            <div className='TodoCardUnder'>
                <input className='Name' value={item.name} onChange={(e)=> {ChangeName(e.target.value, setTodo , item.id, todo)}}/>
                <button onClick={()=> toggleNote(Notes, setNotes, item.id)} className='NotesToggle'>Take notes</button>
                <button onClick={() => DeleteTodo(item, userData, setTodo, setIsLoading)} className='DeleteBTN'>Slett</button>
            </div>
            <div className='TodoCardHidden' 
            style={{
                    opacity: !Notes ? 0  : Notes == item.id? 1 : 0,
                    marginTop: !Notes ? "-45px" : Notes == item.id? "10px" : "-45px",
                    zIndex: !Notes ? -10 : Notes == item.id? 1 : -10
                }}
            >
                <textarea className='Content' value={item.content} onChange={(e)=> {ChangeContent(e.target.value, setTodo , item.id, todo)}}> </textarea>
            </div>
        </div>
    ))} </>)
}
async function getTodos(userData: any, setTodo:any, setIsLoading:any){
    const User = userData
    const { data, error } = await supabase
        .from("Todo")
        .select()
        .eq('user',  User.user.id)
        .order('id', { ascending: false })
    if(!error){
        setTodo(data)
    } else{
        setIsLoading(false)
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error?.message}!</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
}
function toggleNote(Notes: any, setNotes: any, id: any) {
    if (Notes === id) {
        setNotes(null)
    } else {
        setNotes(id)
    }
}
async function changeStatus(item:any, setTodo: any, id:any, todo:any){
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
async function ChangeName(Value:any, setTodo: any, id:any, todo:any){
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
async function ChangeContent(Value:any, setTodo: any, id:any, todo:any){
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
async function DeleteTodo(item:any, userData: any, setTodo:any, setIsLoading:any) {
    const {error} = await supabase
        .from('Todo')
        .delete()
        .eq('id', item.id)
    if(error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error?.message}!</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    getTodos(userData, setTodo, setIsLoading)
}
export default Build
export { getTodos }