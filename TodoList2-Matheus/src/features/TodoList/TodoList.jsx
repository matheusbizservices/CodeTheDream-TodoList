import React, { useMemo } from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todoList, dataVersion, onCompleteTodo, onDeleteTodo, onUpdateTodo }) {

  const filteredTodoList = useMemo(() => {
    console.log(`Recalculating filtered todos (v${dataVersion})`);

    return {
      version: dataVersion,
      todos: todoList.filter(todo => !todo.completed)
    };
  }, [todoList, dataVersion]);

  return (
    <div className="todo-list">
      {filteredTodoList.todos.length === 0 ? (
        <p>No active todos found.</p>
      ) : (
        filteredTodoList.todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onComplete={onCompleteTodo}
            onDelete={onDeleteTodo}
            onUpdate={onUpdateTodo}
          />
        ))
      )}
    </div>
  );
}