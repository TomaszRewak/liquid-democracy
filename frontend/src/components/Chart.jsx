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

function getSegments(results, totalVotes) {
    const segments = [];
    let offset = 0;

    let addSegment = (votes, color) => {
        if (!votes) return;

        const percent = votes / totalVotes;
        segments.push({ percent: percent, offset: offset, color: color });
        offset += percent;
    };

    for (const party of results) {
        addSegment(party.votes.electorial.yea, "green");
        addSegment(party.votes.popular.yea, "lightgreen");
    }
    for (const party of results) {
        addSegment(party.votes.electorial.nay, "red");
        addSegment(party.votes.popular.nay, "pink");
    }
    for (const party of results) {
        addSegment(party.votes.electorial.abstain, "gray");
        addSegment(party.votes.popular.abstain, "lightgray");
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

    const segments = getSegments(results, totalVotes);

    // TODO: draw a pie chart
    return <svg width="200" height="200" viewBox="0 0 200 200">
        <g transform="translate(100,100)">
            <path d={generateArcPath(80, 20, yeaOffset, yeaOffset + yeaPercent)} fill="#4ac234" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 20, nayOffset, nayOffset + nayPercent)} fill="#eb3434" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 20, abstainOffset, abstainOffset + abstainPercent)} fill="gray" stroke="white" strokeWidth={4.5} />

            {
                segments.map((segment, i) => {
                    return <path key={i} d={generateArcPath(80, 100, segment.offset, segment.offset + segment.percent)} fill={segment.color} stroke="white" strokeWidth={4.5} />
                })
            }

            {/* <path d={generateArcPath(80, 100, 0, 0.3)} fill="red" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 100, 0.3, 0.7)} fill="blue" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 100, 0.7, 0.9)} fill="blue" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 100, 0.9, 1)} fill="blue" stroke="white" strokeWidth={4.5} /> */}
        </g>
    </svg>
}