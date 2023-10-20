import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Poll from './pages/poll/Poll';
import { useState, useCallback, useMemo, Fragment } from 'react';
import { Button, Input, Menu, Icon, Dropdown, Container, Segment } from 'semantic-ui-react';
import { ProfileProvider, useProfile, useLogin, useLogout, useSetParty } from './contexts/profileContext';
import { PartiesProvider, useParties } from './contexts/partiesContext';
import { VisibilityProvider, useShowSensitiveData, useToggleShowSensitiveData } from './contexts/visibilityContext';
import Landing from './pages/landing/Landing';

function LoggedInView({ profile }) {
    const logout = useLogout();
    const setParty = useSetParty();
    const parties = useParties();
    const showSensitiveData = useShowSensitiveData();
    const toggleShowSensitiveData = useToggleShowSensitiveData();

    const selectParty = useCallback(async (e, { value }) => {
        setParty(value);
    }, [setParty]);

    const partyOptions = useMemo(() => parties.map(party => ({
        key: party.id,
        text: party.name,
        value: party.id,
        label: { color: party.color, empty: true, circular: true }
    })), [parties]);

    const party = profile['party_affiliation'] || { name: 'Unaffiliated', color: '', is_member: false };

    return (
        <div>
            <Button icon='eye' size='mini' color={showSensitiveData ? undefined : 'red'} onClick={toggleShowSensitiveData} />
            <Dropdown labeled button text={party.name} icon='users' className={`mini icon ${party.color}`} disabled={party.is_member}>
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
                    <Dropdown.Item onClick={logout} style={{ background: 'red' }}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Button size='mini' onClick={logout} color='orange'>Logout</Button>
        </div>
    );
}

function LogInView() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();

    const onSubmit = useCallback(async (event) => {
        event.preventDefault();

        await login(username, password);
    }, [login, password, username]);

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

function TopBar({ children }) {
    return (
        <Menu className='top-menu' fixed='top' borderless={true}>
            <Menu.Item position='left'>
                <Link to='/'>
                    <Button icon size='mini' className='mini' labelPosition='left'>
                        <Icon name='chart pie' />
                        liquid democracy
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item position='right'>
                {children}
            </Menu.Item>
        </Menu>
    );
}

function AppContent() {
    const profile = useProfile();

    if (!profile) {
        return (
            <TopBar>
                <LogInView />
                <Landing />
            </TopBar>
        );
    }

    return (
        <Fragment>
            <TopBar>
                <LoggedInView profile={profile} />
            </TopBar>
            <Container className='main'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/poll/:pollId' element={<Poll />} />
                </Routes>
            </Container>
        </Fragment>
    );
}

function App() {
    return (
        <VisibilityProvider>
            <ProfileProvider>
                <PartiesProvider>
                    <AppContent />
                </PartiesProvider>
            </ProfileProvider>
        </VisibilityProvider>
    );
}

export default App;
