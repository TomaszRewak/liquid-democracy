import { useState, useCallback } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { useLogin } from '../contexts/profileContext';

export function LogInView() {
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
    );
}
