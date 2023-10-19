import { Button, Icon } from "semantic-ui-react";
import { useCastVote, useVoteType } from "../../contexts/votingContext";
import './VotingButtons.css';
import { useShowSensitiveData } from "../../contexts/visibilityContext";

function VotingButton({ newVotewType, color }) {
    const castVote = useCastVote();
    const voteType = useVoteType();
    const showSensitiveData = useShowSensitiveData();
    const shownVoteType = showSensitiveData ? voteType : undefined;

    const icon = shownVoteType === newVotewType
        ? 'check square'
        : 'square outline';
    const className = shownVoteType === newVotewType
        ? 'voting-button selected'
        : 'voting-button';

    return (
        <Button color={color} className={className} onClick={() => castVote(newVotewType)} disabled={!showSensitiveData}>
            <Icon name={icon} />
            {newVotewType}
        </Button>
    );
}

export function VotingButtons() {
    return (
        <Button.Group size="tiny" className="voting-buttons-group">
            <VotingButton newVotewType='Yea' color='green'/>
            <Button.Or />
            <VotingButton newVotewType='Nay' color='red' />
            <Button.Or />
            <VotingButton newVotewType='Abstain' color='grey' />
        </Button.Group>
    );
}