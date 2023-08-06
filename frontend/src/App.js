import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Poll from './pages/poll/Poll';
import { useState, useCallback, useEffect } from 'react';
import useApiUrl from './effects/useApiUrl';
import { Button, Input, Menu, Icon, Dropdown, Container, Segment } from 'semantic-ui-react';

function LoggedInView({ profile }) {
  const logoutUrl = useApiUrl('logout');
  const partiesUrl = useApiUrl('parties');
  const profileUrl = useApiUrl('profile');

  const [parties, setParties] = useState([]);

  const refreshParties = useCallback(async () => {
    const response = await fetch(partiesUrl, { credentials: 'include' });

    if (response.ok) {
      setParties(await response.json());
    }
    else {
      setParties([]);
    }
  }, [partiesUrl]);

  useEffect(() => {
    refreshParties();
  }, [refreshParties]);

  const onLogout = useCallback(async () => {
    await fetch(logoutUrl, { method: 'POST', credentials: 'include' });

    window.location.reload();
  }, [logoutUrl]);

  const selectParty = useCallback(async (e, { value }) => {
    await fetch(profileUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ party_id: value }),
      credentials: 'include'
    });

    window.location.reload(); // TODO: refresh just the profile
  }, [profileUrl]);

  const partyOptions = parties.map(party => ({
    key: party.id,
    text: party.name,
    value: party.id,
    label: { color: party.color, empty: true, circular: true }
  }));

  const party = profile['party_affiliation'] || { name: 'Unaffiliated', color: '' };

  return (
    <div>
      <Button icon='eye' size='mini' />
      <Dropdown labeled button text={party.name} icon='users' className={`mini icon ${party.color}`}>
        <Dropdown.Menu>
          {
            partyOptions.map(party => (
              <Dropdown.Item onClick={selectParty} key={party.key} {...party} />
            ))
          }
          <Dropdown.Item onClick={selectParty} text='Unaffiliated' label={{ empty: true, circular: true }} />
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown labeled button text={profile.username} icon='user' className='mini icon'>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onLogout} style={{ background: 'red' }}>Logout</Dropdown.Item>
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
  const [profile, setProfile] = useState(undefined);
  const profileUrl = useApiUrl('profile');

  const refreshProfile = useCallback(async () => {
    const response = await fetch(profileUrl, { credentials: 'include' });

    if (response.ok) {
      setProfile(await response.json());
    }
    else {
      setProfile(undefined);
    }
  }, [profileUrl]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const authView = profile
    ? <LoggedInView profile={profile} />
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
