import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Poll from './pages/poll/Poll';
import { useState, useCallback, useMemo } from 'react';
import { Button, Input, Menu, Icon, Dropdown, Container, Segment } from 'semantic-ui-react';
import { ProfileProvider, useProfile, useLogin, useLogout, useSetParty } from './contexts/profileContext';
import { PartiesProvider, useParties } from './contexts/partiesContext';

function LoggedInView({ profile }) {
	const logout = useLogout();
	const setParty = useSetParty();
	const parties = useParties();

	const selectParty = useCallback(async (e, { value }) => {
		setParty(value);
	}, [setParty]);

	const partyOptions = useMemo(() => parties.map(party => ({
		key: party.id,
		text: party.name,
		value: party.id,
		label: { color: party.color, empty: true, circular: true }
	})), [parties]);

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

function AuthView() {
	const profile = useProfile();

	return profile
		? <LoggedInView profile={profile} />
		: <LogInView />;
}

function App() {
	return (
		<ProfileProvider>
			<PartiesProvider>
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
						<AuthView />
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
			</PartiesProvider>
		</ProfileProvider>
	);
}

export default App;
