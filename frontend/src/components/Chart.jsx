import './Chart.css'

function generateArcPath(outerRadius, innerRadius, startPercent, endPercent) {
    const startAngle = 2 * Math.PI * startPercent - Math.PI / 2;
    const endAngle = 2 * Math.PI * endPercent - Math.PI / 2;
    const arcSweep = endAngle - startAngle < Math.PI ? "0" : "1";

    return 'M ' + (outerRadius * Math.cos(startAngle)) + ' ' + (outerRadius * Math.sin(startAngle)) + // Move to starting point
        ' A ' + outerRadius + ' ' + outerRadius + ' 0 ' + arcSweep + ' 1 ' + // Draw outer arc path
        (outerRadius * Math.cos(endAngle)) + ' ' + (outerRadius * Math.sin(endAngle)) + // Draw to ending point
        ' L ' + (innerRadius * Math.cos(endAngle)) + ' ' + (innerRadius * Math.sin(endAngle)) + // Draw inner arc path
        ' A ' + innerRadius + ' ' + innerRadius + ' 0 ' + arcSweep + ' 0 ' + // Draw outer arc path
        (innerRadius * Math.cos(startAngle)) + ' ' + (innerRadius * Math.sin(startAngle)) + // Draw to ending point
        ' Z'; // Close path
}

function mapSemanticUIColor(color) {
    switch (color) {
        case "red":
            return "#db2828";
        case "orange":
            return "#f2711c";
        case "yellow":
            return "#fbbd08";
        case "olive":
            return "#b5cc18";
        case "green":
            return "#21ba45";
        case "teal":
            return "#00b5ad";
        case "blue":
            return "#2185d0";
        case "violet":
            return "#6435c9";
        case "purple":
            return "#a333c8";
        case "pink":
            return "#e03997";
        case "brown":
            return "#a5673f";
        case "grey":
            return "#767676";
        case "black":
            return "#1b1c1d";
        default:
            return "#767676";
    }
}

function getBreakdownSegments(results, totalVotes) {
    const segments = [];
    let offset = 0;

    let addSegment = (votes, color) => {
        if (!votes) return;

        const percent = votes / totalVotes;
        segments.push({ percent: percent, offset: offset, color: color });
        offset += percent;
    };

    for (const party of results) {
        addSegment(party.votes.popular.yea, "#4bc968");
        addSegment(party.votes.electorial.yea, "#b1debc");
    }
    for (const party of results) {
        addSegment(party.votes.popular.nay, "#e35656");
        addSegment(party.votes.electorial.nay, "#e8a0a0");
    }
    for (const party of results) {
        addSegment(party.votes.popular.abstain, "#a3a3a3");
        addSegment(party.votes.electorial.abstain, "lightgray");
    }

    return segments;
}

function getPartySegments(results, totalVotes) {
    const segments = [];
    let offset = 0;

    let addSegment = (votes, color) => {
        if (!votes) return;

        const percent = votes / totalVotes;
        segments.push({ percent: percent, offset: offset, color: mapSemanticUIColor(color) });
        offset += percent;
    };

    for (const party of results) {
        const votes = party.votes.popular.yea + party.votes.electorial.yea;
        addSegment(votes, party.party_details.color);
    }
    for (const party of results) {
        const votes = party.votes.popular.nay + party.votes.electorial.nay;
        addSegment(votes, party.party_details.color);
    }
    for (const party of results) {
        const votes = party.votes.popular.abstain + party.votes.electorial.abstain;
        addSegment(votes, party.party_details.color);
    }

    return segments;
}

export default function Chart({ results }) {
    // results: [{party: 1, votes: {electorial: {yea: 10, nay: 5, abstain: 0}, popular: {yea: 100, nay: 50.5, abstain: 10}}}, ...]

    const totalYeaVotes = results.reduce((acc, cur) => acc + cur.votes.electorial.yea + cur.votes.popular.yea, 0);
    const totalNayVotes = results.reduce((acc, cur) => acc + cur.votes.electorial.nay + cur.votes.popular.nay, 0);
    const totalAbstainVotes = results.reduce((acc, cur) => acc + cur.votes.electorial.abstain + cur.votes.popular.abstain, 0);
    const totalVotes = totalYeaVotes + totalNayVotes + totalAbstainVotes;

    if (!totalVotes) return (
        <div>No votes</div>
    );

    const yeaPercent = totalYeaVotes / totalVotes;
    const nayPercent = totalNayVotes / totalVotes;
    const abstainPercent = totalAbstainVotes / totalVotes;

    const yeaOffset = 0;
    const nayOffset = yeaOffset + yeaPercent;
    const abstainOffset = nayOffset + nayPercent;

    const breakdownSegments = getBreakdownSegments(results, totalVotes);
    const partySegments = getPartySegments(results, totalVotes);

    // TODO: Make the animation of rotation work better
    return <svg width="200" height="200" viewBox="0 0 200 200">
        <g transform="translate(100,100)">

            <path d={generateArcPath(10, 20, yeaOffset, yeaOffset + yeaPercent)} fill="#21ba45" stroke="white" strokeWidth={0} />
            <path d={generateArcPath(10, 20, nayOffset, nayOffset + nayPercent)} fill="#db2828" stroke="white" strokeWidth={0} />
            <path d={generateArcPath(10, 20, abstainOffset, abstainOffset + abstainPercent)} fill="gray" stroke="white" strokeWidth={0} />

            <path d={generateArcPath(21.5, 95, yeaOffset, yeaOffset + yeaPercent)} fill="#21ba45" stroke="white" strokeWidth={0} />
            <path d={generateArcPath(21.5, 95, nayOffset, nayOffset + nayPercent)} fill="#db2828" stroke="white" strokeWidth={0} />
            <path d={generateArcPath(21.5, 95, abstainOffset, abstainOffset + abstainPercent)} fill="gray" stroke="white" strokeWidth={0} />

            {
                breakdownSegments.map((segment, i) => {
                    return <path key={i} d={generateArcPath(60, 90, segment.offset, segment.offset + segment.percent)} fill={segment.color} stroke="white" strokeWidth={0} />
                })
            }

            {
                partySegments.map((segment, i) => {
                    return <path key={i} d={generateArcPath(70, 80, segment.offset, segment.offset + segment.percent)} fill={segment.color} stroke="white" strokeWidth={1.5} />
                })
            }

        </g>
    </svg>
}