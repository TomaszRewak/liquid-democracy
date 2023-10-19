import { Card, Pagination } from 'semantic-ui-react';
import { PollsProvider, usePages, usePolls, usePollsFilter, useSetPollsFilter } from '../../contexts/pollsContext';
import PollCard from './PollCard';
import { Fragment, useCallback } from 'react';
import SearchBar from './SearchBar';

function HomeElement() {
    const polls = usePolls();
    const pollsFilter = usePollsFilter();
    const setPollsFilter = useSetPollsFilter();
    const pages = usePages();

    const onPageChange = useCallback((e, { activePage }) => {
        setPollsFilter({ ...pollsFilter, page: activePage });
    }, [pollsFilter, setPollsFilter]);

    return (
        <Fragment>
            <SearchBar />
            <Card.Group itemsPerRow={3}>
                {polls.map(pollId => (
                    <PollCard key={pollId} pollId={pollId} />
                ))}
            </Card.Group>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                <Pagination activePage={pollsFilter.page} totalPages={pages} onPageChange={onPageChange} firstItem={null} lastItem={null} />
            </div>
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