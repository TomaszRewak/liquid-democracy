import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Poll from './pages/poll/Poll';
import { useState, useCallback, useEffect } from 'react';
import useApiUrl from './effects/useApiUrl';
import { Button, Input, Menu } from 'semantic-ui-react';

function LoggedInView(props) {
  const { username } = props;
  const logoutUrl = useApiUrl('logout');

  const onLogout = useCallback(async () => {
    await fetch(logoutUrl, { method: 'POST', credentials: 'include' });

    window.location.reload();
  }, [logoutUrl]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <div>Logged in as {username}</div>
      <Button size='tiny' onClick={onLogout}>Logout</Button>
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
      <Input size='mini' type="text" name="username" onChange={onUsernameChange} />
      <Input size='mini' type="password" name="password" onChange={onPasswordChange} />
      <Button size='mini' type="submit">Login</Button>
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
      <Menu fixed='top' borderless={true}>
        <Menu.Item position='left'>
          <a className='home-link' href='/'>liquid democracy</a>
        </Menu.Item>
        <Menu.Item position='right' className='authentication-menu-item'>
          {authView}
        </Menu.Item>
      </Menu>
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
