import { useState, createContext, useCallback, useEffect, useContext } from "react";
import useApiUrl from '../effects/useApiUrl';
import { useProfile } from './profileContext';

const PartiesContext = createContext();

export function PartiesProvider({ children }) {
    const [parties, setParties] = useState([]);
    const partiesUrl = useApiUrl('parties');
    const profile = useProfile();

    const refreshParties = useCallback(async () => {
        if (!profile)
            return setParties([]);

        const response = await fetch(partiesUrl, { credentials: 'include' });
        const parties = response.ok ?
            await response.json()
            : [];

        setParties(parties);
    }, [partiesUrl, profile]);

    useEffect(() => {
        refreshParties();
    }, [refreshParties]);

    return (
        <PartiesContext.Provider value={{ parties }}>
            {children}
        </PartiesContext.Provider>
    );
}

export function useParties() {
    return useContext(PartiesContext).parties;
}
