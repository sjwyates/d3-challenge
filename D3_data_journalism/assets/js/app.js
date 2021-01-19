const app = new Vue({
    el: '#app',
    data: {
        censusData: null,
        x: 'obesity',
        y: 'poverty',
        xOptions: [
            {key: 'poverty', title: 'In Poverty (%)'},
            {key: 'age', title: 'Age (Median)'},
            {key: 'income', title: 'Household Income (Median)'}
        ],
        yOptions: [
            {key: 'obesity', title: 'Obese (%)'},
            {key: 'smokes', title: 'Smokes (%)'},
            {key: 'healthcare', title: 'Lacks Healthcare (%)'}
        ],
        svg: {width: 960, height: 500, top: 20, right: 40, bottom: 80, left: 100}
    },
    methods: {
        renderAxes: function () {
            const bottomAxis = d3.axisBottom(this.x);

        },
        renderCircles: function () {

        },
        updateToolTip: function () {

        }
    },
    computed: {
        width: function() {
            return this.svg.width - this.svg.left - this.svg.right
        },
        height: function() {
            return this.svg.height - this.svg.top - this.svg.bottom;
        },
        chartGroupTransform: function() {
            return `translate(${this.svg.left}, ${this.svg.top})`
        },
        xScale: function () {
            return d3.scaleLinear()
                .domain([d3.min(this.censusData, state[this.x]) * 0.8,
                    d3.max(this.censusData, state[this.x]) * 1.2
                ])
                .range([0, this.width]);
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
    }
})

