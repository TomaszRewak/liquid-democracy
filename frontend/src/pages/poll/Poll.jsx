import { useState, useCallback, useEffect } from 'react';
import useApiUrl from '../../effects/useApiUrl';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'semantic-ui-react'

export default function Poll() {
    const [voteType, setVoteType] = useState('Nay');
    const [pollResults, setPollResults] = useState(undefined);
    const voteUrl = useApiUrl('vote');
    const { pollId } = useParams();
    const pollResultsUrl = useApiUrl(`polls/${pollId}/results`);

    const refreshPollResults = useCallback(async () => {
        const response = await fetch(pollResultsUrl, { credentials: 'include' });

        if (!response.ok) {
            console.log('Error fetching poll results');
            return;
        }

        const data = await response.json();

        setPollResults(data);
    }, [pollResultsUrl]);

    const handleClick = useCallback(async () => {
        const response = await fetch(voteUrl, {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                poll_id: Number(pollId),
                vote_type: voteType,
                request_id: '550e8400-e29b-41d4-a716-446655440000'
            }),
            credentials: 'include'
        })

        console.log(response);

        await refreshPollResults();
    }, [voteType, voteUrl, pollId, refreshPollResults]);

    useEffect(() => {
        refreshPollResults();
    }, [refreshPollResults]);

    return (
        <div>
            <Link to='/'>Home</Link>
            <h1>Poll</h1>
            <h2>{pollId}</h2>
            <select value={voteType} onChange={e => setVoteType(e.target.value)}>
                <option value='Yea'>Yes</option>
                <option value='Nay'>No</option>
            </select>
            <Button.Group>
                <Button color='green' onClick={handleClick}>
                    Yea
                </Button>
                <Button color='red'>
                    Nay
                </Button>
            </Button.Group>
            {pollResults && (
                <div>
                    <h3>{`Yes: ${pollResults.yes_votes}`}</h3>
                    <h3>{`No: ${pollResults.no_votes}`}</h3>
                </div>
            )}
        </div>
    );
}