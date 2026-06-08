import { useState } from 'react';

import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';

function App() {

// auth stuff
const [email, setEmail] = useState('');
const [token, setToken] = useState('');

// easier to read than checking token everywhere
const hasAccess = Boolean(token);

return (
<div className="app">

  {/* keeping header visible no matter what page state we're in */}
  <Header />

  <main className="main-content">

    
    {hasAccess ? (

      <div className="todos-wrapper">

        {/* optional greeting */}
        {email && (
          <p className="welcome-text">
            Hey {email}
          </p>
        )}

        <TodosPage token={token} />

      </div>

    ) : (

      <div className="auth-section">

        <Logon
          onSetEmail={setEmail}
          onSetToken={setToken}
        />

      </div>

    )}

  </main>

  {/* maybe footer later */}
  {/* <Footer /> */}

</div>

);
}

export default App;