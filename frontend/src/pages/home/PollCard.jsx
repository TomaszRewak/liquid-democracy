import { PollProvider, usePollResults } from "../../contexts/pollContext";
import Chart from '../../components/Chart';
import { VotingProvider, useCastVote, useVoteType } from "../../contexts/votingContext";
import { Button, Icon } from "semantic-ui-react";
import './PollCard.css';

function VotingButton({ newVotewType, color }) {
    const castVote = useCastVote();
    const voteType = useVoteType();

    console.log(voteType);

    const icon = voteType === newVotewType
        ? 'check square'
        : 'square outline';
    const className = !voteType || voteType === newVotewType
        ? 'voting-button'
        : 'voting-button unselected';

    return (
        <Button color={color} className={className} onClick={() => castVote(newVotewType)}>
            <Icon name={icon} />
            {newVotewType}
        </Button>
    );
}

function VotingButtons() {
    return (
        <Button.Group>
            <VotingButton newVotewType='Yea' color='green' />
            <Button.Or />
            <VotingButton newVotewType='Nay' color='red' />
            <Button.Or />
            <VotingButton newVotewType='Abstain' color='grey' />
        </Button.Group>
    );
}

function PollCardElement() {
    const pollResults = usePollResults();

    return (
        <div>
            <Chart results={pollResults} />
            <VotingButtons />
        </div>
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