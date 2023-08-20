import { Card } from 'semantic-ui-react';
import { PollsProvider, usePolls } from '../../contexts/pollsContext';
import PollCard from './PollCard';

function HomeElement() {
    const polls = usePolls();

    return (
        <Card.Group itemsPerRow={3}>
            {polls.map(pollId => (
                <PollCard key={pollId} pollId={pollId} />
            ))}
        </Card.Group>
    );
}

export default function Home() {
    return (
        <PollsProvider>
            <HomeElement />
        </PollsProvider>
    );
}