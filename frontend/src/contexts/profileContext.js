import { useState, createContext, useCallback, useEffect, useContext } from "react";
import useApiUrl from '../effects/useApiUrl';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(undefined);
    const profileUrl = useApiUrl('profile');
    const loginUrl = useApiUrl('login');
    const logoutUrl = useApiUrl('logout');

    const updateProfile = useCallback(async () => {
        const response = await fetch(profileUrl, { credentials: 'include' });
        const profile = response.ok
            ? await response.json()
            : undefined;

        setProfile(profile);
    }, [profileUrl]);

    const login = useCallback(async (username, password) => {
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

    const logout = useCallback(async () => {
        await fetch(logoutUrl, { method: 'POST', credentials: 'include' });

        await updateProfile();
    }, [logoutUrl, updateProfile]);

    const setParty = useCallback(async (partyId) => {
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

    useEffect(() => {
        updateProfile();
    }, [updateProfile]);

    return (
        <ProfileContext.Provider value={{ profile, login, logout, setParty }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext).profile;
}

export function useLogin() {
    return useContext(ProfileContext).login;
}

export function useLogout() {
    return useContext(ProfileContext).logout;
}

export function useSetParty() {
    return useContext(ProfileContext).setParty;
}
