import { PollProvider, usePollResults } from "../../contexts/pollContext";
import Chart from '../../components/Chart';
import { VotingProvider } from "../../contexts/votingContext";
import { VotingButtons } from "./VotingButtons";

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