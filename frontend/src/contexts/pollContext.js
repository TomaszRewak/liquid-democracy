import { useState, createContext, useCallback, useEffect, useContext, useMemo } from "react";
import useApiUrl from '../effects/useApiUrl';
import { useParties } from "./partiesContext";

const PollContext = createContext();

export const PollProvider = ({ pollId, children }) => {
    const [pollDetails, setPollDetails] = useState({});
    const [pollResults, setPollResults] = useState([]);
    const pollDetailsUrl = useApiUrl(`polls/${pollId}`);
    const pollResultsUrl = useApiUrl(`polls/${pollId}/results`);
    const parties = useParties();

    const partyLookup = useMemo(() => {
        return {
            ...Object.fromEntries(parties.map(party => [party.id, { name: party.name, color: party.color }])),
            [null]: { name: 'Unaffiliated', color: 'gray' }
        };
    }, [parties]);

    const fetchPollDetails = useCallback(async () => {
        const response = await fetch(pollDetailsUrl, { credentials: 'include' });
        const data = await response.json();
        setPollDetails(
            {
                ...data,
                start_time: new Date(data.start_time),
                end_time: new Date(data.end_time)
            }
        );
    }, [pollDetailsUrl]);

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
        fetchPollDetails();
    }, [fetchPollDetails]);

    useEffect(() => {
        fetchPollResults();
    }, [fetchPollResults]);

    useEffect(() => {
        const interval = setInterval(() => fetchPollResults(), 5_000);
        return () => clearInterval(interval);
    }, [fetchPollResults]);

    return (
        <PollContext.Provider value={{ pollDetails, pollResults, fetchPollResults }}>
            {children}
        </PollContext.Provider>
    );
};

export function usePollDetails() {
    return useContext(PollContext).pollDetails;
}

export function usePollResults() {
    return useContext(PollContext).pollResults;
}

export function useFetchPollResults() {
    return useContext(PollContext).fetchPollResults;
}
