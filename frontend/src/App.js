import { Form, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Poll from './pages/poll/Poll';
import { useState, useCallback, useEffect } from 'react';
import useApiUrl from './effects/useApiUrl';
import { Button, Input, Menu, Icon, Dropdown, Divider, Container, Segment } from 'semantic-ui-react';

function LoggedInView({ username }) {
  const logoutUrl = useApiUrl('logout');

  const onLogout = useCallback(async () => {
    await fetch(logoutUrl, { method: 'POST', credentials: 'include' });

    window.location.reload();
  }, [logoutUrl]);

  return (
    <div>
      <Button icon='eye' size='mini'/>
      <Dropdown labeled button text={username} icon='user' className='mini icon'>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Button size='mini' onClick={onLogout} color='orange'>Logout</Button>
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
      <Input size='mini' type="text" name="username" placeholder='username' onChange={onUsernameChange} />
      <Input size='mini' type="password" name="password" placeholder='password' onChange={onPasswordChange} />
      <Button size='mini' type="submit" primary>Login</Button>
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
      <Menu className='top-menu' fixed='top' borderless={true}>
        <Menu.Item position='left'>
          <div>
            <Button icon size='mini' className='mini' labelPosition='left' href='/'>
              <Icon name='chart pie' />
              liquid democracy
            </Button>
          </div>
        </Menu.Item>
        <Menu.Item position='right'>
          {authView}
        </Menu.Item>
      </Menu>
      <Container className='main'>
        <Segment>
          <Input></Input>
        </Segment>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/poll/:pollId' element={<Poll />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
