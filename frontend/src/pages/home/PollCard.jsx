import { PollProvider, usePollResults } from "../../contexts/pollContext";
import Chart from '../../components/Chart';

function PollCardElement() {
    const pollResults = usePollResults();

    return (
        <div>
            <Chart results={pollResults} />
        </div>
    );
}

export default function PollCard({ pollId }) {
    return (
        <PollProvider pollId={pollId}>
            <PollCardElement />
        </PollProvider>
    );
}