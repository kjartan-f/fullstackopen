import React, {useState, useEffect} from 'react'
import axios from 'axios'

const CityWeather = ({weather}) => {
  

  if (Object.keys(weather).length === 0) { return <div>Loading weather...</div> }
  console.log(weather.data.current)
  return (
    <div>
      <h2>Weather in {weather.data.location.name}</h2>
      <div>Temprature: {weather.data.current.temp_c}</div>
      <div>Condition: {weather.data.current.condition.text}</div>
      <div>Wind: {weather.data.current.wind_kph} kph direction {weather.data.current.wind_dir}</div>
    </div>
  )
}

const CountryDetail = ({country, weather}) => {
  const langList = (languages) => {

    let languageList = []
    for (const [key, value] of Object.entries(languages)) {
      languageList = [...languageList, <div key={key}>{value}</div>]
    }

    return languageList
  }  

  return (
    <div>
      <h1>{country[0].name.common}</h1>
      <div>Capital: {country[0].capital}</div>
      <div>Population: {country[0].population}</div>
      <h2>Spoken languages</h2>
      {langList(country[0].languages)}
      <img src={country[0].flags.png} width="150" alt="flag" />
      <CityWeather weather={weather} />
    </div>
  )
}

const CountryList = ({country, onSelect}) => {
  return <div>{country.name.common} <button value={country.cca2} onClick={onSelect}>show</button></div>
}

const Countries = ({countries,filter,onSelect}) => {

  const countryFilter = countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (countryFilter.length > 10) {
    return <p>To many results, specify your filter</p>
  }

  return (
    countryFilter.map((country) => <CountryList key={country.cca2} country={country} onSelect={onSelect} />) 
  )
}

function App() {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selCountry, setSelCountry] = useState('')
  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      setCountries(response.data)
      
    })
  },[])

  useEffect(() => {
    if (selCountry === "") return

    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_API_KEY}=${countries.filter((country) => country.cca2 === selCountry)[0].name.common}&aqi=no`
    axios.get(weatherUrl).then(response => {
      setWeather(response)
    })

  },[selCountry])

  const handleFilter = (e) => {
    setFilter(e.target.value)
    setSelCountry('')
  }

  const handleSelect = (e) => {
    setSelCountry(e.target.value)
  }

  return (
    <div>
      find countries <input value={filter} onChange={handleFilter} />
      { 
        (selCountry === "") ?
          (filter.length > 0)  && <Countries countries={countries} filter={filter} onSelect={handleSelect} /> :
          <CountryDetail weather={weather} country={countries.filter((country) => country.cca2 === selCountry)} />
        
      }
      
    </div>
  );
}

export default App;
