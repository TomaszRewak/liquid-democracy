import { Card } from 'semantic-ui-react';
import { PollsProvider, usePolls } from '../../contexts/pollsContext';
import PollCard from './PollCard';
import { Fragment } from 'react';
import SearchBar from './SearchBar';

function HomeElement() {
    const polls = usePolls();

    return (
        <Fragment>
            <SearchBar />
            <Card.Group itemsPerRow={3}>
                {polls.map(pollId => (
                    <PollCard key={pollId} pollId={pollId} />
                ))}
            </Card.Group>
        </Fragment>
    );
}

export default function Home() {
    return (
        <PollsProvider>
            <HomeElement />
        </PollsProvider>
    );
}