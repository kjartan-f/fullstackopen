
import React, {useState, useEffect} from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'
import './index.css'



const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      date : new Date().toISOString(),
      important: Math.random() < 0.5,
      content: newNote
    }


    noteService
      .create(noteObject)
      .then(response => {
        setNotes([...notes, response])
        setNewNote('')

      })
  }

  const toggleImportanceOf = (id) => {
    
    const note = notes.find((note) => note.id === id)
    const changeNote = { ...note, important : !note.important }

    noteService
      .update(id, changeNote)
      .then(response => {
        setNotes(notes.map((note) => note.id !== id? note : response))
      })
      .catch(error => {

        setErrorMessage(`the note '${note.content}' was already deleted from server`)
        setTimeout(function() {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  } 

  const handleNoteChange = (e) => setNewNote(e.target.value)
  const toggleShow = () => setShowAll(!showAll)

  const notesToShow = showAll? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={toggleShow}>{showAll? 'important' : 'all'}</button>
      </div>
      <ul>
        {notesToShow.map((note) => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  )
}


export default App;
