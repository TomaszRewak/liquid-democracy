import { useEffect, useState } from 'react';
import useApiUrl from '../../effects/useApiUrl';
import { Link } from 'react-router-dom';

export default function Home() {
    const [polls, setPolls] = useState(undefined)
    const pollsUrl = useApiUrl('polls');

    useEffect(() => {
        const getPolls = async () => {
            const response = await fetch(pollsUrl, { credentials: 'include' });
            const data = await response.json();

            setPolls(data.polls);
        }

        getPolls();
    }, [pollsUrl]);

    if (polls === undefined) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {polls.map(poll => (
                <Link to={`/poll/${poll.id}`} key={poll.id}>
                    <h3>{poll.name}</h3>
                    <p>{poll.description}</p>
                </Link>
            ))}
        </div>
    );
}