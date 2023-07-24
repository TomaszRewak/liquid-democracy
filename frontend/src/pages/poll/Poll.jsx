import { useState, useCallback } from 'react';
import useApiUrl from '../../effects/useApiUrl';
import { useParams } from 'react-router-dom';

export default function Poll() {
    const [voteType, setVoteType] = useState('Nay');
    const voteUrl = useApiUrl('vote');
    const { pollId } = useParams();

    console.dir(typeof pollId)

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
            })
        })

        console.log(response);
    }, [voteType, voteUrl, pollId]);

    return (
        <div>
            <h1>Poll</h1>
            <h2>{pollId}</h2>
            <select value={voteType} onChange={e => setVoteType(e.target.value)}>
                <option value='Yea'>Yes</option>
                <option value='Nay'>No</option>
            </select>
            <button onClick={handleClick}>
                Click me
            </button>
        </div>
    );
}