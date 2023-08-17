import { Link } from 'react-router-dom';
import { Card, Divider, Header, Icon, Segment } from 'semantic-ui-react';
import { usePolls } from '../../contexts/pollsContext';
import PollCard from './PollCard';

export default function Home() {
    const polls = usePolls();

    return (
        <Card.Group itemsPerRow={3}>
            {polls.map(poll => (
                <Card fluid key={poll.id}>
                    <Card.Content>
                        <Card.Header>
                            {poll.name}
                        </Card.Header>
                        <Card.Meta>{poll.description}</Card.Meta>
                    </Card.Content>
                    <Card.Content extra textAlign='center'>
                        <PollCard pollId={poll.id} />
                    </Card.Content>
                    <Card.Content extra textAlign='right'>
                        <Link to={`/poll/${poll.id}`}>
                            <Icon name='external alternate' />
                        </Link>
                    </Card.Content>
                    <Card.Content extra textAlign='right'>
                        <Icon name='clock' />
                        1w 2d 03h 04m 05s
                    </Card.Content>
                </Card>
            ))}
        </Card.Group>
    );
}