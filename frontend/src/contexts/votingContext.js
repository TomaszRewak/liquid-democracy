import { createContext, useCallback, useContext, useEffect, useState } from "react";
import useApiUrl from '../effects/useApiUrl';
import { useFetchPollResults } from "./pollContext";

const VotingContext = createContext();

export const VotingProvider = ({ pollId, children }) => {
    const [voteType, setVoteType] = useState(null);
    const voteUrl = useApiUrl('vote');
    const fetchPollResults = useFetchPollResults();

    const fetchVoteType = useCallback(async () => {
        const response = await fetch(`${voteUrl}/${pollId}`, { credentials: 'include' });
        const data = await response.json();
        console.log("data: ", pollId, ", ", data);
        setVoteType(data);
    }, [pollId, voteUrl]);

    const castVote = useCallback(async (voteType) => {
        console.dir(JSON.stringify({
            poll_id: Number(pollId),
            vote_type: voteType,
            request_id: '550e8400-e29b-41d4-a716-446655440000'
        }))
        await fetch(voteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                poll_id: Number(pollId),
                vote_type: voteType,
                request_id: '550e8400-e29b-41d4-a716-446655440000'
            }),
            credentials: 'include'
        });

        await fetchVoteType();
        await fetchPollResults();
    }, [fetchPollResults, fetchVoteType, pollId, voteUrl]);

    useEffect(() => {
        fetchVoteType();
    }, [fetchVoteType]);

    return (
        <VotingContext.Provider value={{ castVote, voteType }}>
            {children}
        </VotingContext.Provider>
    );
}

export function useCastVote() {
    return useContext(VotingContext).castVote;
}

export function useVoteType() {
    return useContext(VotingContext).voteType;
}