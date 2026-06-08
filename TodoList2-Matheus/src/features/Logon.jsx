import { useState } from 'react';

export default function Logon({ onSetEmail, onSetToken }) {

// probably could combine some of these into one object state

const [email, updateEmail] = useState('');
const [password, updatePassword] = useState('');

const [authError, setAuthError] = useState('');
const [isLoggingOn, setIsLoggingOn] = useState(false);

async function handleSubmit(e) {
e.preventDefault();

setIsLoggingOn(true);
setAuthError('');

// small guard just in case browser validation gets bypassed somehow
if (!email || !password) {
  setAuthError('Please fill out both fields');
  setIsLoggingOn(false);
  return;
}

try {

  const payload = {
    email: email,
    password: password,
  };

  const response = await fetch('/api/users/logon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  // I originally had response.ok here but wanted to be explicit
  if (response.status === 200) {

    if (data && data.name && data.csrfToken) {

      onSetEmail(data.name);
      onSetToken(data.csrfToken);

    } else {
      setAuthError('Login worked but response data looked weird');
    }

  } else {

    const errMsg = data?.message || 'Check credentials';
    setAuthError(`Authentication failed: ${errMsg}`);
  }

} catch (err) {

  // fetch errors/network stuff land here
  console.error('logon error:', err);

  setAuthError(`Error: ${err.message}`);

} finally {

  // making sure button gets re-enabled no matter what
  setIsLoggingOn(false);
}

}

return (
<form onSubmit={handleSubmit} className="logon-form">

  {authError ? (
    <p style={{ color: 'red', marginBottom: '10px' }}>
      {authError}
    </p>
  ) : null}

  <label htmlFor="email">
    Email:
  </label>

  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => {
      updateEmail(e.target.value);
    }}
    required
  />

  <label htmlFor="password">
    Password:
  </label>

  <input
    id="password"
    type="password"
    value={password}
    onChange={(e) => updatePassword(e.target.value)}
    required
  />

  <button
    type="submit"
    disabled={isLoggingOn}
  >
    {isLoggingOn ? 'Logging in...' : 'Log On'}
  </button>



</form>

);
}