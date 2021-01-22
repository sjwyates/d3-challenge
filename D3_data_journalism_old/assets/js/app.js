// -----------------------------------------------------------------------------
// Set heights/widths/margins
// -----------------------------------------------------------------------------

const svgParams = {
    tWidth: 960,
    tHeight: 500,
    mTop: 20,
    mRight: 40,
    mBottom: 140,
    mLeft: 120,
};

svgParams.iWidth = svgParams.tWidth - svgParams.mRight - svgParams.mLeft;
svgParams.iHeight = svgParams.tHeight - svgParams.mTop - svgParams.mBottom;

// -----------------------------------------------------------------------------
// Create svg and container group elements
// -----------------------------------------------------------------------------

const svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svg.tWidth)
    .attr('height', svg.tHeight);

const chartGroup = svg.append('g')
    .attr('transform', `translate(${svgParams.mLeft}, ${svgParams.mTop})`);

// -----------------------------------------------------------------------------
// State management
// -----------------------------------------------------------------------------

const selected = {
    x: 'poverty',
    y: 'obesity',
};

// -----------------------------------------------------------------------------
// Helper functions to create x and y scales
// -----------------------------------------------------------------------------

function xScale(data) {
    return d3.scaleLinear()
        .domain([d3.min(data, d => d[selected.x]) * 0.95,
            d3.max(data, d => d[selected.x]) * 1.05]);
}

function yScale(data) {
    return d3.scaleLinear()
        .domain([d3.min(data, d => d[selected.y]) * 0.95,
            d3.max(data, d => d[selected.y]) * 1.05]);
}

// -----------------------------------------------------------------------------
// Functions to call on events
// -----------------------------------------------------------------------------

function renderXAxis(xAxis) {
    const bottomAxis = d3.axisBottom(selected.x);
    return xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
}

function renderYAxis(yAxis) {
    const leftAxis = d3.axisLeft(selected.y);
    return yAxis.transition()
        .duration(1000)
        .call(leftAxis);
}

function renderCircles(circlesGroup) {
    return circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => xScale(d[selected.x]))
        .attr('cy', d => xScale(d[selected.y]));
}

function updateToolTip(circlesGroup) {
    const ttLabels = {
        poverty: ['Poverty: ', '%'],
        age: ['Age: ', ''],
        income: ['Income: $', ''],
        obesity: ['Obesity: ', '%'],
        smokes: ['Smokes: ', '%'],
        healthcare: ['Lacks Healthcare: ', '%'],
    };
    const toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html((d) => `<h3>${d.state}</h3><hr>
            <h4>${ttLabels[selected.x][0]}${d[selected.x]}${ttLabels[selected.x][1]}</h4>
            <h4>${ttLabels[selected.y][0]}${d[selected.y]}${ttLabels[selected.y][1]}</h4>`);
    return circlesGroup
        .call(toolTip)
        .on('mouseover', (data) => toolTip.show(data))
        .on('mouseout', (data) => toolTip.hide(data));
}

// -----------------------------------------------------------------------------
// Fetch CSV, do initial chart build
// -----------------------------------------------------------------------------

d3.csv('../data/data.csv').then((data) => {
    const chartData = data.map(row => {
        const { state, abbr, poverty, age, income, healthcare, obesity, smokes } = row;
        return {
            state,
            abbr,
            poverty: +poverty,
            age: +age,
            income: +income,
            healthcare: +healthcare,
            obesity: +obesity,
            smokes: +smokes,
        };
    });

})


const axisLabels = {
    poverty: 'In Poverty (%)',
    age: 'Age (Median)',
    income: 'Income (Median)',
    obesity: 'Obese (%)',
    smokes: 'Smokes (%)',
    healthcare: 'Lacks Healthcare (%)',
};