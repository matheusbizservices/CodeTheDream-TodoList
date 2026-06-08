import React, { useState, useEffect, useCallback } from 'react';
import useDebounce from '../../utils/useDebounce';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';

export default function TodosPage({ token }) {

  const [todoList, setTodoList] = useState([]);
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [error, setError] = useState('');

  const [sortBy, setSortBy] = useState('creationDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const [dataVersion, setDataVersion] = useState(0);

  const [filterError, setFilterError] = useState('');

  const invalidateCache = useCallback(() => {
    console.log("Invalidating memo cache after todo mutation");
    setDataVersion(prev => prev + 1);
  }, []);

  const fetchTodos = useCallback(async () => {
    setIsTodoListLoading(true);

    const paramsObject = { sortBy, sortDirection };
    if (debouncedFilterTerm) {
      paramsObject.find = debouncedFilterTerm;
    }
    const params = new URLSearchParams(paramsObject);

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'include'
    };

    try {
      const resp = await fetch(`/api/tasks?${params}`, options);
      if (!resp.ok) {
        throw new Error(`HTTP Error! Status: ${resp.status}`);
      }
      const data = await resp.json();

      setTodoList(data);
      setFilterError('');
      setError('');
    } catch (err) {

      if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
        setFilterError(`Error filtering/sorting todos: ${err.message}`);
      } else {
        setError(`Error fetching todos: ${err.message}`);
      }
    } finally {
      setIsTodoListLoading(false);
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (title) => {
    const tempId = crypto.randomUUID();
    const tempTodo = { id: tempId, title, completed: false, creationDate: new Date().toISOString() };

    const originalList = [...todoList];
    setTodoList(prev => [tempTodo, ...prev]);

    try {
      const resp = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
        credentials: 'include'
      });
      if (!resp.ok) throw new Error('Could not sync new task.');
      const savedTodo = await resp.json();

      setTodoList(prev => prev.map(t => t.id === tempId ? savedTodo : t));
      invalidateCache();
    } catch (err) {
      setTodoList(originalList);
      setError(`Mutation Failed: ${err.message}`);
    }
  };

  const handleResetFilters = () => {
    setFilterTerm('');
    setSortBy('creationDate');
    setSortDirection('desc');
    setFilterError('');
  };

  return (
    <div className="todos-page" style={{ padding: '20px' }}>
      {}
      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>
          <p>{error}</p>
          <button onClick={() => setError('')}>Clear Error</button>
        </div>
      )}

      {}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={setFilterTerm}
      />

      {}
      {filterError && (
        <div style={{ color: 'orange', border: '1px solid orange', padding: '10px', marginBottom: '10px' }}>
          <p>{filterError}</p>
          <button onClick={() => setFilterError('')} style={{ marginRight: '8px' }}>Clear Filter Error</button>
          <button onClick={handleResetFilters}>Reset Filters</button>
        </div>
      )}

      <TodoForm onAddTodo={handleAddTodo} />

      {isTodoListLoading ? (
        <p>Loading todo list options...</p>
      ) : (
        <TodoList
          todoList={todoList}
          dataVersion={dataVersion}

        />
      )}
    </div>
  );
}