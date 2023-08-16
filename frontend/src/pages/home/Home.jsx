import { Link } from 'react-router-dom';
import { Divider, Header, Icon, Segment } from 'semantic-ui-react';
import { usePolls } from '../../contexts/pollsContext';
import PollCard from './PollCard';

export default function Home() {
    const polls = usePolls();

    return (
        <div>
            {polls.map(poll => (
                <Segment key={poll.id}>
                    <Header as='h4'>
                        {poll.name}
                        <Link to={`/poll/${poll.id}`}>
                            <Icon name='external alternate' />
                            </Link>
                    </Header>
                    <Divider />
                    <PollCard pollId={poll.id} />
                    <p>{poll.description}</p>
                </Segment>
            ))}
        </div>
    );
}