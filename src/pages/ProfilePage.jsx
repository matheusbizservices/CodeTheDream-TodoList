import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { token, email } = useAuth();
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch('/api/tasks', options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        
        // Handle array or wrapped response `{ tasks: [] }`
        const todosArray = data.tasks ? data.tasks : data;

        const total = todosArray.length;
        const completed = todosArray.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionPercentage = todoStats.total > 0 
    ? Math.round((todoStats.completed / todoStats.total) * 100) 
    : 0;

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p>Logged in as: <strong>{email}</strong></p>

      <h3>Todo Statistics</h3>
      {loading && <p>Loading stats...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <ul>
          <li>Total Todos: {todoStats.total}</li>
          <li>Completed: {todoStats.completed}</li>
          <li>Active: {todoStats.active}</li>
          <li>Completion Rate: {completionPercentage}%</li>
        </ul>
      )}
    </div>
  );
}

export default ProfilePage;
