import React, { useState } from 'react'

const Button = ({handleClick,text}) => <button onClick={handleClick}>{text}</button> 

const StatisticLine = (props) => {
  return <tr><td>{props.text}</td><td>{props.value}</td></tr>
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0) 

  const average = () => {
    return ((good + neutral + bad) === 0)? "No feedback given" : ((good*1)+(bad*-1))/(good+neutral+bad)
  }

  return (
    <>
      <h1>Give feedback</h1>
      <Button handleClick={() => setGood(prevGood => prevGood+1)} text="Good" />
      <Button handleClick={() => setNeutral(prevNautral => prevNautral+1)} text="Nautral" />
      <Button handleClick={() => setBad(prevBad => prevBad+1)} text="Bad" />
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All" value={good+neutral+bad} />
          <StatisticLine text="Average" value={average()} />
        </tbody>
      </table>
    </>
  )
}


export default App