import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Poll from './pages/poll/Poll';
import { useState, useCallback, useEffect } from 'react';
import useApiUrl from './effects/useApiUrl';

function LoggedInView(props) {
  const { username } = props;
  const logoutUrl = useApiUrl('logout');

  const onLogout = useCallback(async () => {
    await fetch(logoutUrl, { method: 'POST', credentials: 'include' });

    window.location.reload();
  }, [logoutUrl]);

  return (
    <div>
      <h1>Logged in as {username}</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

function LogInView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginUrl = useApiUrl('login');

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    window.location.reload();
  }, [loginUrl, password, username]);

  const onUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const onPasswordChange = useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <label>
        Username:
        <input type="text" name="username" onChange={onUsernameChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" onChange={onPasswordChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

function App() {
  const [username, setUsername] = useState(undefined);
  const usernameUrl = useApiUrl('username');

  const refreshUsername = useCallback(async () => {
    const response = await fetch(usernameUrl, { credentials: 'include' });

    if (response.ok) {
      setUsername(await response.json());
    }
    else {
      setUsername(undefined);
    }
  }, [usernameUrl]);

  useEffect(() => {
    refreshUsername();
  }, [refreshUsername]);

  const authView = username
    ? <LoggedInView username={username} />
    : <LogInView />;

  return (
    <div>
      <h1>App</h1>
      {authView}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/poll/:pollId' element={<Poll />} />
      </Routes>
    </div>
  );
}

export default App;
