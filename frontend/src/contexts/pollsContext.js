import { useState, createContext, useCallback, useEffect, useContext } from "react";
import useApiUrl from '../effects/useApiUrl';
import { useProfile } from './profileContext';

const PollsContext = createContext();

export function PollsProvider({ children }) {
    const [polls, setPolls] = useState([]);
    const pollsUrl = useApiUrl('polls');
    const profile = useProfile();

    const refreshPolls = useCallback(async () => {
        if (!profile)
            return setPolls([]);

        const response = await fetch(pollsUrl, { credentials: 'include' });
        const polls = response.ok ?
            (await response.json()).polls
            : [];

        setPolls(polls);
    }, [pollsUrl, profile]);

    useEffect(() => {
        refreshPolls();
    }, [refreshPolls]);

    return (
        <PollsContext.Provider value={{ polls }}>
            {children}
        </PollsContext.Provider>
    );
}

export function usePolls() {
    return useContext(PollsContext).polls;
}