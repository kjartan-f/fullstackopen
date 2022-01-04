const Input = ({text,value,onChange}) => {
    return (
      <p>
          {text} <input value={value} onChange={onChange} />
      </p>
    )
  }

export default Input