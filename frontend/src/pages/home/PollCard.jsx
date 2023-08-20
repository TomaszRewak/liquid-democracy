import { Link } from 'react-router-dom';
import { Card, Divider, Grid, Icon } from 'semantic-ui-react';
import { PollProvider, usePollDetails, usePollResults } from "../../contexts/pollContext";
import Chart from '../../components/Chart';
import { VotingProvider } from "../../contexts/votingContext";
import { VotingButtons } from "./VotingButtons";
import './PollCard.css';
import { StatisticsLabel } from './StatisticsLabel';

function PollCardElement() {
    const poll = usePollDetails();
    const pollResults = usePollResults();

    const totalYeaVotes = pollResults.reduce((acc, cur) => acc + cur.votes.electorial.yea + cur.votes.popular.yea, 0);
    const totalNayVotes = pollResults.reduce((acc, cur) => acc + cur.votes.electorial.nay + cur.votes.popular.nay, 0);
    const totalAbstainVotes = pollResults.reduce((acc, cur) => acc + cur.votes.electorial.abstain + cur.votes.popular.abstain, 0);
    const totalVotes = totalYeaVotes + totalNayVotes + totalAbstainVotes;

    return (
        <Card className='poll-card' fluid>
            <Card.Content>
                <Card.Header>
                    <Link to={`/poll/${poll.id}`}>
                        <Icon name='external alternate' className='right floated' style={{ opacity: 0.2 }} />
                        {poll.name}
                    </Link>
                </Card.Header>
                <Card.Meta>{poll.description}</Card.Meta>
            </Card.Content>
            <Card.Content extra textAlign='center' className='chart-card-content'>
                <Grid padded >
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <Chart results={pollResults} />
                        </Grid.Column>
                        <Grid.Column width={4} className='statistics-column'>
                            <StatisticsLabel icon='check circle' color='green' value={totalYeaVotes} />
                            <StatisticsLabel icon='times circle' color='red' value={totalNayVotes} />
                            <StatisticsLabel icon='circle' color='grey' value={totalAbstainVotes} />
                            <Divider />
                            <StatisticsLabel icon='users' color='blue' value={totalVotes} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Content>
            <Card.Content extra textAlign='center'>
                <VotingButtons />
            </Card.Content>
            <Card.Content extra textAlign='center'>
                <span className='left floated'>
                    <Icon name='comment' />
                    123
                </span>
                <span className='floated'>
                    <Icon name='clock' />
                    ends <span style={{opacity: 0.3}}>in</span> 1w 2d 03h
                </span>
                <span className='right floated' style={{color: 'orange'}}>
                    <Icon name='bullhorn' />
                    123
                </span>
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