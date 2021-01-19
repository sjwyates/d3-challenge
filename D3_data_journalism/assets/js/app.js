const svgWidth = 960;
const svgHeight = 500;

const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const app = new Vue({
    el: '#app',
    data: {
        xOptions: [
            {
                key: 'poverty',
                title: 'In Poverty (%)'
            },
            {
                key: 'age',
                title: 'Age (Median)'
            },
            {
                key: 'income',
                title: 'Household Income (Median)'
            }
        ],
        yOptions: [
            {
                key: 'obesity',
                title: 'Obese (%)'
            },
            {
                key: 'smokes',
                title: 'Smokes (%)'
            },
            {
                key: 'healthcare',
                title: 'Lacks Healthcare (%)'
            }
        ],
        selected: {
            x: 0,
            y: 0
        },
        data: []
    },
    methods: {
        xScale: function () {

        },
        renderAxes: function () {

        },
        renderCircles: function () {

        },
        updateToolTip: function () {

        }
    },
    created: async function () {
        const data = await d3.csv("./assets/data/data.csv")
        this.data = data.map(theState => {
                return {
                    state: theState.state,
                    abbr: theState.abbr,
                    poverty: +theState.poverty,
                    age: +theState.age,
                    income: +theState.income,
                    obesity: +theState.obesity,
                    smokes: +theState.smokes,
                    healthcare: +theState.healthcare
                }
            })
    }
})

