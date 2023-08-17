import { useState, createContext, useCallback, useEffect, useContext, useMemo } from "react";
import useApiUrl from '../effects/useApiUrl';
import { useParties } from "./partiesContext";

const PollContext = createContext();

export const PollProvider = ({ pollId, children }) => {
    const [pollResults, setPollResults] = useState([]);
    const pollResultsUrl = useApiUrl(`polls/${pollId}/results`);
    const parties = useParties();

    const partyLookup = useMemo(() => {
        return {
            ...Object.fromEntries(parties.map(party => [party.id, { name: party.name, color: party.color }])),
            [null]: { name: 'Unaffiliated', color: 'gray' }
        };
    }, [parties]);

    const fetchPollResults = useCallback(async () => {
        const response = await fetch(pollResultsUrl, { credentials: 'include' });
        const data = await response.json();
        const results = data.votes_by_party.map(vote => ({
            ...vote,
            party_details: partyLookup[vote.party] ?? partyLookup[null]
        }));
        setPollResults(results);
    }, [partyLookup, pollResultsUrl]);

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

export function useFetchPollResults() {
    return useContext(PollContext).fetchPollResults;
}
