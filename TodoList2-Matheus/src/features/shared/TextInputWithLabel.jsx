import React from 'react';

function TextInputWithLabel(props) {

const {
elementId,
labelText,
onChange,
value
} = props;


// might use it for other forms later too
return (
<>

  <label htmlFor={elementId}>
    {labelText}
  </label>

  <input
    type="text"
    id={elementId}
    value={value}
    onChange={onChange}
    autoComplete="off" {{
      
    }}
  />


</>

);
}

export default TextInputWithLabel;