<template>
  <div id="scatter" class="svg-container"></div>
</template>

<script>
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import * as tip from 'd3-tip';

export default {
  name: 'SVGContainer',
  props: {
    chartData: Array,
    svgParams: Object,
    x: String,
    y: String,
  },
  data() {
    return {
      xOptions: {
        poverty: { axisTitle: 'In Poverty (%)', ttTitle: 'Poverty', ttUnits: ' %' },
        age: { axisTitle: 'Age (Median)', ttTitle: 'Age', ttUnits: '' },
        income: { axisTitle: 'Household Income (Median)', ttTitle: 'Income', ttUnits: '' },
      },
      yOptions: {
        obesity: { axisTitle: 'Obese (%)', ttTitle: 'Obesity', ttUnits: ' %' },
        smokes: { axisTitle: 'Smokes (%)', ttTitle: 'Smokes', ttUnits: ' %' },
        healthcare: { axisTitle: 'Lacks Healthcare (%)', ttTitle: 'Healthcare', ttUnits: ' %' },
      },
    };
  },
  methods: {
    toolTip() {
      return tip.default()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function tipText(d) {
          const xText = `${this.xOptions[this.x].ttTitle}: ${d.x}${this.xOptions[this.x].ttUnits}`;
          const yText = `${this.xOptions[this.y].ttTitle}: ${d.y}${this.xOptions[this.y].ttUnits}`;
          return (`${d.state}<hr>${xText}<br>${yText}`);
        });
    },
    generatePlot() {
      const xScale = scaleLinear()
        .domain([min(this.chartData, (state) => state.x),
          max(this.chartData, (state) => state.x),
        ])
        .range([0, this.width]);
      const yScale = scaleLinear()
        .domain([min(this.chartData, (state) => state.y),
          max(this.chartData, (state) => state.y),
        ])
        .range([this.height, 0]);
      const svg = select('#scatter')
        .append('svg')
        .attr('width', this.svgParams.width)
        .attr('height', this.svgParams.height);
      const chartGroup = svg.append('g')
        .attr('transform', `translate(${this.svgParams.left}, ${this.svgParams.right})`);
      const xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${this.svgHeight})`)
        .call(axisBottom(xScale));
      const yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .call(axisLeft(yScale));
      const circlesGroup = chartGroup.selectAll('circle')
        .data(this.chartData.data)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 20)
        .attr('fill', 'blue')
        .attr('opacity', '0.5');
      const xLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${this.svgWidth / 2}, ${this.svgHeight + 20})`);
      Array.entries(Object.entries(this.xOptions)).forEach(([index, [key, value]]) => {
        xLabelsGroup.append('text')
          .attr('x', 0)
          .attr('y', (index + 1) * 20)
          .classed('axis-text', true)
          .attr('value', key)
          .text(value.title)
          .on('click', function shouldUpdate() {
            const nodeValue = select(this).attr('value');
            if (nodeValue !== this.x) {
              this.x = nodeValue;
            }
          });
      });
      const yLabelsGroup = chartGroup.append('g');
      Array.entries(Object.entries(this.yOptions)).forEach(([index, [key, value]]) => {
        yLabelsGroup.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - this.svgParams.left)
          .attr('x', 0 - this.svgHeight / 2)
          .attr('dy', `${index + 1}em`)
          .classed('axis-text', true)
          .attr('value', key)
          .text(value.title)
          .on('click', function shouldUpdate() {
            const nodeValue = select(this).attr('value');
            if (nodeValue !== this.y) {
              this.y = nodeValue;
            }
          });
      });
      return {
        svg, chartGroup, xAxis, yAxis, circlesGroup, xLabelsGroup, yLabelsGroup,
      };
    },
  },
  computed: {
    svgWidth() {
      return this.svgParams.width - this.svgParams.left - this.svgParams.right;
    },
    svgHeight() {
      return this.svgParams.height - this.svgParams.top - this.svgParams.bottom;
    },
  },
  mounted() {
    this.generatePlot();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
