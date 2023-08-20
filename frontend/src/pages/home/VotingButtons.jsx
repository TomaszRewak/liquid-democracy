import { Button, Icon } from "semantic-ui-react";
import { useCastVote, useVoteType } from "../../contexts/votingContext";
import './VotingButtons.css';

function VotingButton({ newVotewType, color }) {
    const castVote = useCastVote();
    const voteType = useVoteType();

    const icon = voteType === newVotewType
        ? 'check square'
        : 'square outline';
    const className = voteType === newVotewType
        ? 'voting-button selected'
        : 'voting-button';

    return (
        <Button color={color} className={className} onClick={() => castVote(newVotewType)}>
            <Icon name={icon} />
            {newVotewType}
        </Button>
    );
}

export function VotingButtons() {
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