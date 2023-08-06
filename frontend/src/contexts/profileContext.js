import React from "react";
import useApiUrl from '../effects/useApiUrl';

export const ProfileContext = React.createContext();

export function ProfileProvider({ children }) {
    const [profile, setProfile] = React.useState(undefined);
    const profileUrl = useApiUrl('profile');
    const loginUrl = useApiUrl('login');
    const logoutUrl = useApiUrl('logout');

    const updateProfile = React.useCallback(async () => {
        const response = await fetch(profileUrl, { credentials: 'include' });
        const profile = response.ok
            ? await response.json()
            : undefined;

        setProfile(profile);
    }, [profileUrl]);

    const login = React.useCallback(async (username, password) => {
        await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        await updateProfile();
    }, [loginUrl, updateProfile]);

    const logout = React.useCallback(async () => {
        await fetch(logoutUrl, { method: 'POST', credentials: 'include' });

        await updateProfile();
    }, [logoutUrl, updateProfile]);

    const setParty = React.useCallback(async (partyId) => {
        await fetch(profileUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ party_id: partyId }),
            credentials: 'include'
        });

        await updateProfile();
    }, [profileUrl, updateProfile]);

    React.useEffect(() => {
        updateProfile();
    }, [updateProfile]);

    return (
        <ProfileContext.Provider value={{ profile, login, logout, setParty }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return React.useContext(ProfileContext).profile;
}

export function useLogin() {
    return React.useContext(ProfileContext).login;
}

export function useLogout() {
    return React.useContext(ProfileContext).logout;
}

export function useSetParty() {
    return React.useContext(ProfileContext).setParty;
}
