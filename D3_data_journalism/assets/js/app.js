// -----------------------------------------------------------------------------
// Set heights/widths/margins
// -----------------------------------------------------------------------------

const svgParams = {
    tWidth: window.innerWidth * 0.95,
    tHeight: 500,
    mTop: 40,
    mRight: window.innerWidth * 0.1,
    mBottom: 100,
    mLeft: window.innerWidth * 0.1,
};

svgParams.iWidth = svgParams.tWidth - svgParams.mRight - svgParams.mLeft;
svgParams.iHeight = svgParams.tHeight - svgParams.mTop - svgParams.mBottom;

// -----------------------------------------------------------------------------
// Create svg and container group elements
// -----------------------------------------------------------------------------

const svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgParams.tWidth)
    .attr('height', svgParams.tHeight);

const chartGroup = svg.append('g')
    .attr('transform', `translate(${svgParams.mLeft}, ${svgParams.mTop})`);

svg.append('text')
    .attr('transform', `translate(${svgParams.iWidth / 2 + svgParams.mLeft}, ${svgParams.mTop / 2})`)
    .attr('text-anchor', 'middle')
    .classed('chart-title', true)
    .text('Correlations');

// -----------------------------------------------------------------------------
// State management
// -----------------------------------------------------------------------------

const selected = {
    x: 'poverty',
    y: 'obesity',
};

// -----------------------------------------------------------------------------
// Helper functions to create x and y linear scales
// -----------------------------------------------------------------------------

function linearScale(axis, data) {
    const offset = axis === 'x' ? 0.05 : 0.2;
    return d3.scaleLinear()
        .domain([d3.min(data, d => d[selected[axis]]) * (1 - offset),
            d3.max(data, d => d[selected[axis]]) * (1 + offset)])
        .range(axis === 'x' ? [0, svgParams.iWidth] : [svgParams.iHeight, 0]);
}

// -----------------------------------------------------------------------------
// Functions to call on events
// -----------------------------------------------------------------------------

function renderAxis(axis, axisObj, scale) {
    return axisObj.transition()
        .duration(500)
        .call(axis === 'x' ? d3.axisBottom(scale) : d3.axisLeft(scale));
}

function renderCircles(circlesGroup, scale, axis) {
    circlesGroup.selectAll('circle')
        .transition()
        .duration(500)
        .attr(`c${axis}`, d => scale(d[selected[axis]]));
    circlesGroup.selectAll('text')
        .transition()
        .duration(500)
        .attr(axis, d => scale(d[selected[axis]]));
}

function updateToolTip(circlesGroup) {
    const ttLabels = {
        poverty: ['Poverty: ', '%'],
        age: ['Median Age: ', ''],
        income: ['Median Income: $', ''],
        obesity: ['Obesity: ', '%'],
        smokes: ['Smokes: ', '%'],
        healthcare: ['Lacks Healthcare: ', '%'],
    };
    const toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([80, -60])
        .html((d) => {
            return `<strong>${d.state}</strong><br>
            ${ttLabels[selected.x][0]}${d[selected.x]}${ttLabels[selected.x][1]}<br>
            ${ttLabels[selected.y][0]}${d[selected.y]}${ttLabels[selected.y][1]}`
        });
    circlesGroup
        .call(toolTip);
    circlesGroup
        .on('mouseover', function(data) {
            toolTip.show(data, this)
        })
        .on('mouseout', function(data) {
            toolTip.hide(data)
        });
}

// -----------------------------------------------------------------------------
// Fetch CSV, do initial chart build
// -----------------------------------------------------------------------------

d3.csv('./assets/data/data.csv').then((data) => {

    // Step 1: Slim down and clean the data
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

    // Step 2: Initialize the x/y axes
    let xScale = linearScale('x', chartData);
    let xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${svgParams.iHeight})`)
        .call(d3.axisBottom(xScale));
    let yScale = linearScale('y', chartData);
    let yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .call(d3.axisLeft(yScale));

    // Step 3: Initialize the circles
    const circlesGroup = chartGroup.append('g')
        .classed('circle-group', true)
        .selectAll('circle')
        .data(chartData)
        .enter()
        .append('g');

    circlesGroup.append('circle')
        .attr('cx', d => xScale(d[selected.x]))
        .attr('cy', d => yScale(d[selected.y]))
        .classed('stateCircle', true)
        .attr('r', 15);

    circlesGroup.append('text')
        .classed('stateText', true)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(d => d.abbr)
        .attr('x', d => xScale(d[selected.x]))
        .attr('y', d => yScale(d[selected.y]));

    // Step 5: Update tooltip
    updateToolTip(circlesGroup);

    // Step 6: Initialize the axis labels
    // 6a: Create groups to hold them
    const xLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${svgParams.iWidth / 2}, ${svgParams.iHeight + 20})`)
        .classed('x-label-group', true);
    const yLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${0 - svgParams.mLeft}, ${svgParams.iHeight / 2})`)
        .classed('y-label-group', true);
    // 6b: Iterate over "lists" of "tuples" to create labels
    [['poverty', 'In Poverty (%)'], ['age', 'Age (Median)'], ['income', 'Income (Median)']]
        .forEach((label, index) => {
            xLabelsGroup.append('text')
                .attr('x', 0)
                .attr('y', (index + 1) * 20)
                .attr('text-anchor', 'middle')
                .attr('value', label[0])
                .attr('id', `${label[0]}Label`)
                .classed('aText', true)
                .classed('active', !index)
                .classed('inactive', index)
                .text(label[1])
                .on('click', () => clickHandler('x', label[0]));
        });
    [['obesity', 'Obese (%)'], ['smokes', 'Smokes (%)'], ['healthcare', 'Lacks Healthcare (%)']]
        .forEach((label, index) => {
            yLabelsGroup.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .attr('dy', `${index + 1}em`)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .attr('value', label[0])
                .attr('id', `${label[0]}Label`)
                .classed('aText', true)
                .classed('active', !index)
                .classed('inactive', index)
                .text(label[1])
                .on('click', () => clickHandler('y', label[0]));
        });

    // Step 7: Create the callback function for the click events (generic for x and y)
    function clickHandler(axis, value) {
        if (selected[axis] !== value) {
            selected[axis] = value;
            if (axis === 'x') {
                xScale = linearScale('x', chartData);
                renderAxis('x', xAxis, xScale);
                renderCircles(circlesGroup, xScale, axis);
            }
            if (axis === 'y') {
                yScale = linearScale('y', chartData);
                renderAxis('y', yAxis, yScale);
                renderCircles(circlesGroup, yScale, axis);
            }
            updateToolTip(circlesGroup);
            chartGroup.select(`.${axis}-label-group`)
                .selectAll('text')
                .classed('active', false)
                .classed('inactive', true);
            chartGroup.select(`#${value}Label`)
                .classed('active', true)
                .classed('inactive', false);
        }
    }
})


