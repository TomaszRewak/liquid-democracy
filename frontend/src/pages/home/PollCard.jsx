import { Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
import { PollProvider, usePollDetails, usePollResults } from "../../contexts/pollContext";
import Chart from '../../components/Chart';
import { VotingProvider } from "../../contexts/votingContext";
import { VotingButtons } from "./VotingButtons";

function PollCardElement() {
    const poll = usePollDetails();
    const pollResults = usePollResults();

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>
                    {poll.name}
                </Card.Header>
                <Card.Meta>{poll.description}</Card.Meta>
            </Card.Content>
            <Card.Content extra textAlign='center'>
                <Chart results={pollResults} />
            </Card.Content>
            <Card.Content extra textAlign='center'>
                <VotingButtons />
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
    );
}

export default function PollCard({ pollId }) {
    return (
        <PollProvider pollId={pollId}>
            <VotingProvider pollId={pollId}>
                <PollCardElement />
            </VotingProvider>
        </PollProvider>
    );
}