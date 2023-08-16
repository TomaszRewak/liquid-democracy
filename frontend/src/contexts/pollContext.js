import { useState, createContext, useCallback, useEffect, useContext } from "react";
import useApiUrl from '../effects/useApiUrl';

const PollContext = createContext();

export const PollProvider = ({ pollId, children }) => {
    const [pollResults, setPollResults] = useState([]);
    const pollResultsUrl = useApiUrl(`polls/${pollId}/results`);

    const fetchPollResults = useCallback(async () => {
        const response = await fetch(pollResultsUrl, { credentials: 'include' });
        const data = await response.json();
        setPollResults(data.votes_by_party);
    }, [pollResultsUrl]);

    useEffect(() => {
        fetchPollResults();
    }, [fetchPollResults]);

    return (
        <PollContext.Provider value={{ pollResults, fetchPollResults }}>
            {children}
        </PollContext.Provider>
    );
};

export function usePollResults() {
    return useContext(PollContext).pollResults;
}

