import { useState } from 'react';

import TextInputWithLabel from '../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../utils/todoValidation';

function TodoListItem(props) {

const {
todo,
onCompleteTodo,
onUpdateTodo
} = props;

const [isEditing, setIsEditing] = useState(false);

// local state while editing title
const [workingTitle, setWorkingTitle] = useState(todo.title);

const handleUpdate = (event) => {

event.preventDefault();

// extra safety check
if (!isEditing) {
  return;
}

const cleanedTitle = workingTitle.trim();

if (isValidTodoTitle(cleanedTitle)) {

  onUpdateTodo({
    ...todo,
    title: cleanedTitle
  });

  setIsEditing(false);

}

};

const handleCancel = () => {

// reset changes if user cancels
setWorkingTitle(todo.title);

setIsEditing(false);

};

return (
<li className="todo-list-item">

  <form onSubmit={handleUpdate}>

    {isEditing ? (

      <>

        <TextInputWithLabel
          elementId={`edit-${todo.id}`}
          labelText="Edit Todo: "
          value={workingTitle}
          onChange={(e) => {
            setWorkingTitle(e.target.value);
          }}
        />

        <button
          type="button"
          onClick={handleUpdate}
          disabled={!isValidTodoTitle(workingTitle)}
        >
          Update
        </button>

        <button
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </button>

      </>

    ) : (

      <>

        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => {
            onCompleteTodo(todo.id);
          }}
        />

        <span
          onClick={() => {
            setIsEditing(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          {todo.title}
        </span>

        
        {/* easier for accessibility probably */}

      </>

    )}

  </form>

</li>

);
}

export default TodoListItem;