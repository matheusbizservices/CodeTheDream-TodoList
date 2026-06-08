import React, { useState, useRef } from 'react';

function TodoForm(props) {

const [workingTodoTitle, setWorkingTodoTitle] = useState('');

const inputRef = useRef();

const handleAddTodo = (event) => {

event.preventDefault();

const cleanedTitle = workingTodoTitle.trim();

// don't allow blank todos
if (cleanedTitle) {

  props.onAddTodo(cleanedTitle);

  setWorkingTodoTitle('');

  if (inputRef.current) {
    inputRef.current.focus();
  }

}

};

return (
<form onSubmit={handleAddTodo}>

  <label htmlFor="todoTitle">
    Todo:
  </label>

  <input
    ref={inputRef}
    type="text"
    id="todoTitle"
    value={workingTodoTitle}
    onChange={(e) => {
      setWorkingTodoTitle(e.target.value);
    }}
    placeholder="Todo text"
  />

  <button
    type="submit"
    disabled={!workingTodoTitle.trim()}
  >
    Add Todo
  </button>

  {/* maybe character limit later */}
  {/* <small>Max 100 chars?</small> */}

</form>

);
}

export default TodoForm;