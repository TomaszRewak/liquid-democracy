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

export default function Chart({ results }) {
    // results: [{party: 'party a', electorialVotes: {yea: 10, nay: 5}, popularVotes: {yea: 100, nay: 50}}, ...]

    // const yeaVotes = results.reduce((acc, result) => acc + result.electorialVotes.yea + result.popularVotes.yea, 0);
    // const nayVotes = results.reduce((acc, result) => acc + result.electorialVotes.nay + result.popularVotes.nay, 0);
    // const totalVotes = yeaVotes + nayVotes;



    // TODO: draw a pie chart
    return <svg width="200" height="200" viewBox="0 0 200 200">
        <g transform="translate(100,100)">
            <path d={generateArcPath(80, 20, 0, 0.7)} fill="#4ac234" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 20, 0.7, 0.9)} fill="#eb3434" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 20, 0.9, 1)} fill="gray" stroke="white" strokeWidth={4.5} />

            <path d={generateArcPath(80, 100, 0, 0.3)} fill="red" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 100, 0.3, 0.7)} fill="blue" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 100, 0.7, 0.9)} fill="blue" stroke="white" strokeWidth={4.5} />
            <path d={generateArcPath(80, 100, 0.9, 1)} fill="blue" stroke="white" strokeWidth={4.5} />
        </g>
    </svg>
}