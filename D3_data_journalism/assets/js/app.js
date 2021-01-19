const app = new Vue({
    el: '#app',
    data: {
        censusData: null,
        x: 'obesity',
        y: 'poverty',
        xOptions: {poverty: 'In Poverty (%)', age: 'Age (Median)', income: 'Household Income (Median)'},
        yOptions: {obesity: 'Obese (%)', smokes: 'Smokes (%)', healthcare: 'Lacks Healthcare (%)'},
        svg: {width: 960, height: 500, top: 20, right: 40, bottom: 80, left: 100},
        xAxis: null,
        yAxis: null
    },
    methods: {
        renderAxes: function () {
            const bottomAxis = d3.axisBottom(this.x);

        },
        renderCircles: function () {

        },
        updateToolTip: function () {

        },
        xScale: function() {
            return d3.scaleLinear()
                .domain([d3.min(this.censusData, state => state[this.x]),
                    d3.max(this.censusData, state => state[this.x])
                ])
                .range([0, this.width]);
        },
        yScale: function() {
            return d3.scaleLinear()
                .domain([d3.min(this.censusData, state => state[this.y]),
                    d3.max(this.censusData, state => state[this.y])
                ])
                .range([this.height, 0]);
        }
    },
    computed: {
        width: function () {
            return this.svg.width - this.svg.left - this.svg.right
        },
        height: function () {
            return this.svg.height - this.svg.top - this.svg.bottom;
        }
    },
    created: async function () {
        const res = await d3.csv("./assets/data/data.csv")
        this.censusData = res.map(state => {
            return {
                state: state.state,
                abbr: state.abbr,
                poverty: +state.poverty,
                age: +state.age,
                income: +state.income,
                obesity: +state.obesity,
                smokes: +state.smokes,
                healthcare: +state.healthcare
            }
        })
        d3.select("#xAxis").call(d3.axisBottom(this.xScale));
        d3.select("#yAxis").call(d3.axisLeft(this.yScale));
        const chartGroup = d3.select("#chartGroup");
        const circlesGroup = chartGroup.selectAll("circle")
            .data(this.censusData)
            .enter()
            .append("circle")
            .attr("cx", d => d)
    }
})

