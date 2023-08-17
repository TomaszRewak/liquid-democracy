import { createContext, useCallback, useContext } from "react";
import useApiUrl from '../effects/useApiUrl';
import { useFetchPollResults } from "./pollContext";

const VotingContext = createContext();

export const VotingProvider = ({ pollId, children }) => {
    const voteUrl = useApiUrl('vote');
    const fetchPollResults = useFetchPollResults();

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

        fetchPollResults();
    }, [fetchPollResults, pollId, voteUrl]);

    return (
        <VotingContext.Provider value={{ castVote }}>
            {children}
        </VotingContext.Provider>
    );
}

export function useCastVote() {
    return useContext(VotingContext).castVote;
}