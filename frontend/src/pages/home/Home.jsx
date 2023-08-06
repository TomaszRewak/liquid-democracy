import { useEffect, useState } from 'react';
import useApiUrl from '../../effects/useApiUrl';
import { Link } from 'react-router-dom';
import { Card, Divider, Header, Icon, Segment } from 'semantic-ui-react';
import Chart from '../../components/Chart';

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
                <Segment key={poll.id}>
                    <Header as='h2'>
                        {poll.name}
                        <Link to={`/poll/${poll.id}`}>
                            <Icon name='external alternate' />
                            </Link>
                    </Header>
                    <Divider />
                    <Chart/>
                    <p>{poll.description}</p>

                </Segment>
            ))}
        </div>
    );
}