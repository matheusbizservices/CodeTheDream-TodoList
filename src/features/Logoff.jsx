import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout, email } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState('');

  const handleLogoff = async () => {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  };

  return (
    <div className="logoff">
      <span>Logged in as {email}</span>
      <button onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? 'Logging off...' : 'Log Off'}
      </button>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default Logoff;
