import Delete from '../assets/3405244.png'
function BuildNoteList({ Notes, newNote, deleteNote, openNote, currentNote, setCurrentNote, userData, setNotes }: {Notes: any, newNote: any, deleteNote: any, openNote: any, currentNote: any, setCurrentNote: any, userData: any, setNotes: any}) {
    return (
        <>
        <div id='NotesHeader'>
            <h1>Notes</h1>
            <button onClick={()=> newNote(setNotes, userData, setCurrentNote)} className="Secondary NewNote">+ Ny</button>
        </div>
        <ul id="NoteList">
            {Notes.length === 0 ? <p>Her var det tomt, prøv å lage ditt første notat!</p> : Notes.map((note: any) => {
                return (
                    <li key={note.id} className={"NoteInList " + (currentNote && currentNote.id === note.id ? "active" : "")} onClick={() => openNote(note.id, Notes, setCurrentNote)}>
                        <p className="NoteInListName">{note.Name}</p>
                        <button onClick={()=> deleteNote(Notes, setNotes, note.id)} className="DeleteBTN2 No-Button">
                            <img src={Delete} alt="Delete" />
                        </button>
                    </li>
                )
            }) }
        </ul>
        </>
    )
}
export default BuildNoteList