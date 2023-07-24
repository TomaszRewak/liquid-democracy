import { useEffect, useState } from 'react';
import useApiUrl from '../../effects/useApiUrl';

export default function Home() {
    const [polls, setPolls] = useState(undefined)
    const pollsUrl = useApiUrl('polls');

    useEffect(() => {
        const getPolls = async () => {
            const response = await fetch(pollsUrl);
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
                <div key={poll.id}>
                    <h3>{poll.name}</h3>
                    <p>{poll.description}</p>
                </div>
            ))}
        </div>
    );
}