import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/Todos/TodoForm';
import TodoList from '../features/Todos/TodoList/TodoList';
import SortBy from '../shared/SortBy';
import FilterInput from '../shared/FilterInput';
import StatusFilter from '../shared/StatusFilter';
import useDebounce from '../utils/useDebounce';
import { useAuth } from '../contexts/AuthContext';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../reducers/todoReducer';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const statusFilter = searchParams.get('status') || 'all';

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filterTerm: newTerm } });
  };

  const handleSortByChange = (newSortBy) => {
    dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy: newSortBy, sortDirection } });
  };

  const handleSortDirectionChange = (newSortDirection) => {
    dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection: newSortDirection } });
  };

  const handleResetFilters = () => {
    dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
  };

  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      dispatch({ type: TODO_ACTIONS.FETCH_START });
      try {
        const paramsObject = { sortBy, sortDirection };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) throw new Error('Unauthorized — please log in again.');
        if (!response.ok) throw new Error('Failed to fetch todos. Please try again.');

        const data = await response.json();
        dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos: data.tasks } });
      } catch (err) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: `Error fetching/sorting todos: ${err.message}`,
            isFilterError: !!(debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc')
          }
        });
      }
    };

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const addTodo = async (todoTitle) => {
    const newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: { tempTodo: newTodo } });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
        credentials: 'include',
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (!response.ok) throw new Error('Failed to add todo.');
      const data = await response.json();

      dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: { tempId: newTodo.id, savedTodo: data } });
    } catch (err) {
      dispatch({ type: TODO_ACTIONS.ADD_TODO_ERROR, payload: { tempId: newTodo.id, message: `Error adding todo: ${err.message}` } });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id } });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true }),
      });

      if (!response.ok) throw new Error('Failed to complete todo.');
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (err) {
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_ERROR, payload: { id, originalTodo, message: `Error completing todo: ${err.message}` } });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
        credentials: 'include',
        body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted }),
      });

      if (!response.ok) throw new Error('Failed to update todo.');
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch (err) {
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { editedTodo, originalTodo, message: `Error updating todo: ${err.message}` } });
    }
  };

  return (
    <div>
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>Clear Error</button>
        </div>
      )}

      {filterError && (
        <div className="error-message">
          <p>{filterError}</p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>Clear Filter Error</button>
          <button onClick={handleResetFilters}>Reset Filters</button>
        </div>
      )}

      {isTodoListLoading && <p className="loading-indicator">Loading todos...</p>}

      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={handleSortByChange} onSortDirectionChange={handleSortDirectionChange} />
      <StatusFilter />
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      
      <TodoForm onAddTodo={addTodo} />
      
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
