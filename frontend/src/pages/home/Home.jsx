import { Link } from 'react-router-dom';
import { Divider, Header, Icon, Segment } from 'semantic-ui-react';
import Chart from '../../components/Chart';
import { usePolls } from '../../contexts/pollsContext';

export default function Home() {
    const polls = usePolls();

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