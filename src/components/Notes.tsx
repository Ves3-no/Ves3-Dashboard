import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import BuildNoteList from './BuildNoteList'
function Notes ({ userData }: { userData: any}){
    const [Notes, setNotes] = useState<any>([])
    const [currentNote, setCurrentNote] = useState<any>(null)
    useEffect(() => {
        if (userData) {
            getNotes(userData, setNotes, setCurrentNote)
        }
    }, [userData])
    return(
        <>
        <div id='NotesLeft'>
            <BuildNoteList Notes={Notes} newNote={newNote} deleteNote={deleteNote} openNote={openNote} currentNote={currentNote} setCurrentNote={setCurrentNote} userData={userData} setNotes={setNotes}/>
        </div>
        <div id='NotesRight'>
            {currentNote ? 
            <>
                <input className='NoteTitle' value={currentNote.Name} onChange={(e)=> uptateNoteTitle(currentNote.id, Notes, setNotes, e.target.value, currentNote, setCurrentNote)}/>
                <textarea className='NoteContent' value={currentNote.Content} onChange={(e)=> uptateNoteContent(currentNote.id, Notes, setNotes, e.target.value, currentNote, setCurrentNote)}/>
            </>
            : 
            <p className='NoNote'>Ingen notater valgt</p>}
        </div>
        </>
    )
}
async function getNotes(userData: any, setNotes: any, setCurrentNote: any) {
    const User = userData
    const { data, error } = await supabase
        .from("Notes")
        .select("*")
        .eq('user',  User.user.id)
        .order('created_at', { ascending: false })
    if(!error){
        setNotes(data)
        setCurrentNote(data[0])
    } else{
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    
}
async function openNote( id: any, Notes: any, setCurrentNote: any) {
    const Note = Notes.find((note: any) => note.id === id)
    setCurrentNote(Note)
}
async function deleteNote(Notes: any, setNotes: any, id: any, setCurrentNote: any, currentNote: any) {
    const response = await supabase
        .from('Notes')
        .delete()
        .eq('id', id)
    if(response.error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${response.error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    const ny = Notes.filter((item: any) => item.id !== id);
    if (currentNote.id == (Notes.filter((item: any) => item.id === id))[0].id) {
        setCurrentNote(ny[0])
    } 
    setNotes(ny);


}
async function newNote(setNotes: any, userData: any, setCurrentNote: any) {
    const { error } = await supabase
        .from('Notes')
        .insert({ user: userData.user.id, Name: "Ny note", Content: "" })
    if(error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    getNotes(userData, setNotes, setCurrentNote)
}
async function uptateNoteTitle(id: any, Notes: any, setNotes: any, value: any, currentNote: any, setCurrentNote: any) {
    const nya = { ...currentNote, Name: value }
    setCurrentNote(nya)
    const { error } = await supabase
        .from('Notes')
        .update({ Name: value })
        .eq('id', id)
    if(error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    const ny = Notes.map((item:any)=>{
        if(item.id == id){
            return{ ...item, Name: value }
        }
        return item
    })
    setNotes(ny)

}
async function uptateNoteContent(id: any, Notes: any, setNotes: any, value: any, currentNote: any, setCurrentNote: any) {
    const nya = { ...currentNote, Content: value }
    setCurrentNote(nya)
    const { error } = await supabase
        .from('Notes')
        .update({ Content: value })
        .eq('id', id)
    if(error){
        document.querySelector('.popup')!.innerHTML = `<p class="error">${error.message}</p>`
        document.querySelector('.popup')!.classList.add('active')
        setTimeout(() => {
            document.querySelector('.popup')!.classList.remove('active')
        }, 3000)
    }
    const ny = Notes.map((item:any)=>{
        if(item.id == id){
            return{ ...item, Content: value }
        }
        return item
    })
    setNotes(ny)
}
export default Notes