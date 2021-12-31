import React from 'react'

const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}

const Part = ({part}) => <p>{part.name} {part.exercises}</p>

const Total = ({course}) => <p style={{fontWeight:"bold"}}>Total of {course.parts.reduce((sum, part) => sum + part.exercises,0  ) } exercises</p>

const Course = ({course}) => {
  return (
    <div>
      <Header course={course} />
      {course.parts.map( (part) => <Part key={part.id} part={part} />)}
      <Total course={course} />
    </div>
  )
}


export default Course