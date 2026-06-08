import { useState, useRef } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../utils/todoValidation';

function TodoForm(props) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();

    const cleanedTitle = workingTodoTitle.trim();

    // don't allow blank todos
    if (isValidTodoTitle(cleanedTitle)) {
      props.onAddTodo(cleanedTitle);

      setWorkingTodoTitle('');

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={inputRef}
        elementId="todoTitle"
        labelText="Todo: "
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />

      <button
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
