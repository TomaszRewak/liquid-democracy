import { PollProvider, usePollResults } from "../../contexts/pollContext";
import Chart from '../../components/Chart';
import { VotingProvider, useCastVote } from "../../contexts/votingContext";
import { Button } from "semantic-ui-react";

function PollCardElement() {
    const pollResults = usePollResults();
    const castVote = useCastVote();

    return (
        <div>
            <Chart results={pollResults} />
            <Button.Group>
                <Button color='green' onClick={() => castVote('Yea')}>
                    Yea
                </Button>
                <Button color='red' onClick={() => castVote('Nay')}>
                    Nay
                </Button>
                <Button color='gray' onClick={() => castVote('Abstain')}>
                    Abstain
                </Button>
            </Button.Group>
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