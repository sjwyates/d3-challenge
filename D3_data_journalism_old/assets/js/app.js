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

const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svg.tWidth)
    .attr("height", svg.tHeight);

const chartGroup = svg.append("g")
    .attr("transform", `translate(${svgParams.mLeft}, ${svgParams.mTop})`);

const currentAxes = {
    x: 'poverty',
    y: 'obesity',
};

const axisLabels = {
    poverty: 'In Poverty (%)',
    age: 'Age (Median)',
    income: 'Income (Median)',
    obesity: 'Obese (%)',
    smokes: 'Smokes (%)',
    healthcare: 'Lacks Healthcare (%)',
};

const toolTipLabels = {
    poverty: 'In Poverty (%)',
    age: 'Age (Median)',
    income: 'Income (Median)',
    obesity: 'Obese (%)',
    smokes: 'Smokes (%)',
    healthcare: 'Lacks Healthcare (%)',
}

function xScale(data) {
    return d3.scaleLinear()
        .domain([d3.min(data, d => d[currentAxes.x]) * 0.95,
            d3.max(data, d => d[currentAxes.x]) * 1.05])
}

function yScale(data) {
    return d3.scaleLinear()
        .domain([d3.min(data, d => d[currentAxes.y]) * 0.95,
            d3.max(data, d => d[currentAxes.y]) * 1.05])
}

function renderXAxis(xAxis) {
    const bottomAxis = d3.axisBottom(currentAxes.x);
    return xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
}

function renderYAxis(yAxis) {
    const leftAxis = d3.axisLeft(currentAxes.y);
    return yAxis.transition()
        .duration(1000)
        .call(leftAxis);
}

function renderCircles(circlesGroup) {


}

function updateToolTip(circlesGroup) {

}