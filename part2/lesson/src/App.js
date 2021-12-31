
import React, {useState} from 'react'
import Note from './components/Note'



const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('a new note...')
  
  const addNote = (event) => {
    event.preventDefault();
    const newObject = {
      id : notes.length + 1,
      date : new Date().toISOString(),
      important: Math.random() < 0.5,
      content: newNote
    }
    
    setNotes([...notes, newObject])
    setNewNote('')
  }

  const handleNoteChange = (e) => setNewNote(e.target.value)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => <Note key={note.id} note={note} />)}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}


export default App;
