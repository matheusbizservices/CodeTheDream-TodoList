// reusable labelled text input. In React 19 ref is just a regular prop,
// so we accept it and forward it to the underlying <input> so callers
// like TodoForm can focus the field.
function TextInputWithLabel({ elementId, labelText, onChange, value, ref }) {
  return (
    <>
      <label htmlFor={elementId}>
        {labelText}
      </label>

      <input
        ref={ref}
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </>
  );
}

export default TextInputWithLabel;
