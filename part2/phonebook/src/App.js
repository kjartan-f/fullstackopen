import React, { useState, useEffect }  from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Input from './components/Input'
import './index.css'


const Filter = (props) => {
  return <Input text="filter persons by" value={props.filterby} onChange={props.updateFilter} />
}

const PersonForm = ({handleSumbit,newPerson,handleNewPerson,newNumber,handleNewNumber}) => {
  return (
    <form onSubmit={handleSumbit}>
      <div>
        <Input text="Name:" value={newPerson} onChange={handleNewPerson} />
      </div>
      <div>
        <Input text="Phonenumber:" value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, deletePerson}) => {
  return persons.map((person) => <Person key={person.name} name={person.name} number={person.number} deletePerson={() => deletePerson(person.id)} />)
}

const Person = ({name, number, deletePerson}) => {
  return <div>{name} {number} <button onClick={deletePerson}>Delete</button></div>
}


function App() {

  const [persons,setPersons] = useState([])
  const [newPerson, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  },[])
  

  const handleFilter = (e) => {
    setFilter(e.target.value)
  }
  
  const handleNewPerson = (e) => setNewPerson(e.target.value)
  const handleNewNumber = (e) => setNewNumber(e.target.value)

  const addPerson = (e) => {
    e.preventDefault();

    if (persons.find((person) => person.name.toLowerCase() === newPerson.toLowerCase())) {
      if (window.confirm(`${newPerson} is already in the phonebook, replace the old number with the new?`)) {
        updatePerson()
      } 
      return
    }

    personService
      .create({name: newPerson, number: newNumber})
      .then(newPerson => {
        setPersons([...persons, newPerson])
        setNewPerson('')
        setNewNumber('')
        setMessage(`Added ${newPerson.name}`)
        setMessageType('success')
        setTimeout(function(){
          setMessage(null)
        },5000)
      })
  }

  const updatePerson = () => {
    const selPerson = persons.find((person) => person.name.toLowerCase() === newPerson.toLowerCase())
    personService
      .update(selPerson.id, {name: newPerson, number: newNumber})
      .then(updatedPerson => {
        setPersons(persons.map((person) => selPerson.id !== person.id? person :updatedPerson ))
        setNewPerson('')
        setNewNumber('')
        setMessage(`Updated ${updatedPerson.name}`)
        setMessageType('success')
        setTimeout(function(){
          setMessage(null)
        },5000)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find((person)=> person.id === id)


    if (window.confirm(`Are you sure you want to delete ${person.name}`))
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter((person) => person.id !== id))
        })
        .catch(error => {
          setMessageType('error')
          setMessage(`${person.name} has already been deleted from the server`)
          setTimeout(function() {
            setMessage(null)
          },5000)
        })
  }

  const filterPersons = () => {
    const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    return filteredPersons
  }


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} type={messageType} />
      <Filter filterby={filter}  updateFilter={handleFilter} />
      
      <h2>Add a new</h2>

      <PersonForm handleSumbit={addPerson} newPerson={newPerson} handleNewPerson={handleNewPerson} newNumber={newNumber} handleNewNumber={handleNewNumber}/>
        
      <h2>Numbers</h2>
      <Persons persons={filterPersons()} deletePerson={deletePerson} />
    </div>
  );
}

export default App;
