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
    .attr('width', svgParams.tWidth)
    .attr('height', svgParams.tHeight);

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
// Helper functions to create x and y linear scales
// -----------------------------------------------------------------------------

function linearScale(axis, data) {
    return d3.scaleLinear()
        .domain([d3.min(data, d => d[selected[axis]]) * 0.95,
            d3.max(data, d => d[selected[axis]]) * 1.05])
        .range(axis === 'x' ? [0, svgParams.iWidth] : [svgParams.iHeight, 0]);
}

// -----------------------------------------------------------------------------
// Functions to call on events
// -----------------------------------------------------------------------------

function renderAxis(axis, axisObj, scale) {
    return axisObj.transition()
        .duration(1000)
        .call(axis === 'x' ? d3.axisBottom(scale) : d3.axisLeft(scale));
}

function renderCircles(circlesGroup, axis) {
    return circlesGroup.transition()
        .duration(1000)
        .attr(`c${axis}`, d => linearScale(axis, d));
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
        .attr('transform', `translate(0, ${svgParams.iHeight}`)
        .call(d3.axisBottom(xScale));
    let yScale = linearScale('y', chartData);
    let yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .call(d3.axisLeft(yScale));

    // Step 3: Initialize the circles
    let circlesGroup = chartGroup.selectAll('circle')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d[selected.x]))
        .attr('cy', d => yScale(d[selected.y]))
        .attr('r', 5)
        .classed('stateCircle', true);

    // Step 4: Update tooltip
    circlesGroup = updateToolTip(circlesGroup);

    // Step 5: Initialize the axis labels
    // 5a: Create groups to hold them
    const xLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${svgParams.iWidth / 2}, ${svgParams.iHeight + 20})`)
        .classed('x-label-group', true);
    const yLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${0 - svgParams.left}, ${svgParams.iHeight / 2}`)
        .classed('y-label-group', true);
    // 5b: Iterate over "lists" of "tuples" to create labels
    [['poverty', 'In Poverty (%)'], ['age', 'Age (Median)'], ['income', 'Income (Median)']]
        .forEach((label, index) => {
            xLabelsGroup.append('text')
                .attr('x', 0)
                .attr('y', (index + 1) * 20)
                .attr('text-anchor', 'middle')
                .attr('value', label[0])
                .classed('active', !index)
                .classed('inactive', index)
                .text(label[1])
                .on('click', clickHandler('x', value));
        });
    [['obesity', 'Obese (%)'], ['smokes', 'Smokes (%)'], ['healthcare', 'Lacks Healthcare (%)']]
        .forEach((label, index) => {
            yLabelsGroup.append('text')
                .attr('x', (index + 1) * 20)
                .attr('y', 0)
                .attr('text-anchor', 'middle')
                .attr('value', label[0])
                .classed('active', !index)
                .classed('inactive', index)
                .text(label[1])
                .on('click', clickHandler('y', value));
        });

    // Step 6: Create the callback function for the click events (generic for x and y)
    function clickHandler(axis, value) {
        if (selected[axis] !== value) {
            selected[axis] = value;
            if (axis === 'x') {
                xScale = linearScale('x', chartData);
                xAxis = renderAxis('x', xAxis, xScale);
            }
            if (axis === 'y') {
                yScale = linearScale('y', chartData);
                yAxis = renderAxis('y', yAxis, yScale);
            }
            circlesGroup = renderCircles(circlesGroup, axis);
            circlesGroup = updateToolTip(circlesGroup);
            chartGroup.select(`.${axis}-label-group`)
                .selectAll('text')
                .classed('active', false)
                .classed('inactive', true);
            chartGroup.select(`#${value}`)
                .classed('active', true)
                .classed('inactive', false);
        }
    }
})


