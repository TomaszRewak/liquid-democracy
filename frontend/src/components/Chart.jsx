function generateArcPath(outerRadius, innerRadius, startPercent, endPercent) {
    const startAngle = 2 * Math.PI * startPercent;
    const endAngle = 2 * Math.PI * endPercent;
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
            <path d={generateArcPath(70, 20, 0, 0.7)} fill="red" />
            <path d={generateArcPath(70, 20, 0.7, 1)} fill="blue" />

            <path d={generateArcPath(80, 100, 0, 0.3)} fill="red" />
            <path d={generateArcPath(80, 100, 0.3, 0.7)} fill="blue" />
        </g>
    </svg>
}