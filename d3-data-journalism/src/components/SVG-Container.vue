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
        poverty: { axisTitle: 'In Poverty (%)', tooltipTitle: 'Poverty', tooltipUnits: ' %' },
        age: { axisTitle: 'Age (Median)', tooltipTitle: 'Age', tooltipUnits: '' },
        income: { axisTitle: 'Household Income (Median)', tooltipTitle: 'Income', tooltipUnits: '' },
      },
      yOptions: {
        obesity: { axisTitle: 'Obese (%)', tooltipTitle: 'Obesity', tooltipUnits: ' %' },
        smokes: { axisTitle: 'Smokes (%)', tooltipTitle: 'Smokes', tooltipUnits: ' %' },
        healthcare: { axisTitle: 'Lacks Healthcare (%)', tooltipTitle: 'Healthcare', tooltipUnits: ' %' },
      },
    };
  },
  methods: {
    xScale() {
      return scaleLinear()
        .domain([min(this.chartData, (state) => state.x),
          max(this.chartData, (state) => state.x),
        ])
        .range([0, this.width]);
    },
    yScale() {
      return scaleLinear()
        .domain([min(this.chartData, (state) => state.y),
          max(this.chartData, (state) => state.y),
        ])
        .range([this.height, 0]);
    },
    renderCircles() {

    },
    updateToolTip() {

    },
  },
  computed: {
    svgWidth() {
      return this.svgParams.width - this.svgParams.left - this.svgParams.right;
    },
    svgHeight() {
      return this.svgParams.height - this.svgParams.top - this.svgParams.bottom;
    },
    svg() {
      return select('#scatter')
        .append('svg')
        .attr('width', this.svgParams.width)
        .attr('height', this.svgParams.height);
    },
    chartGroup() {
      return this.svg.append('g')
        .attr('transform', `translate(${this.svgParams.left}, ${this.svgParams.right})`);
    },
    xAxis() {
      return this.chartGroup.append('g')
        .classed('axis', true)
        .attr('transform', `translate(0, ${this.height}`)
        .call(axisBottom(this.xScale()));
    },
    yAxis() {
      return this.chartGroup.append('g')
        .classed('axis', true)
        .call(axisLeft(this.yScale()));
    },
    circlesGroup() {
      const circlesGroup = this.chartGroup.selectAll('circle')
        .data(this.chartData.data)
        .enter()
        .append('circle')
        .attr('cx', this.xScale)
        .attr('cy', this.yScale)
        .attr('r', 20)
        .attr('fill', 'blue')
        .attr('opacity', '0.5');
      const toolTip = tip.default()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function tipText(d) {
          const xText = `${this.xOptions[this.x].tooltipTitle}: ${d.x}${this.xOptions[this.x].tooltipUnits}`;
          const yText = `${this.xOptions[this.y].tooltipTitle}: ${d.y}${this.xOptions[this.y].tooltipUnits}`;
          return (`${d.state}<hr>${xText}<br>${yText}`);
        });
      circlesGroup.call(toolTip);
      return circlesGroup;
    },
    xLabelsGroup() {
      const labelsGroup = this.chartGroup.append('g')
        .attr('transform', `translate(${this.width / 2}, ${this.height + 20})`);
      Array.entries(Object.entries(this.xOptions)).forEach(([index, [key, value]]) => {
        labelsGroup.append('text')
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
      return labelsGroup;
    },
    yLabelsGroup() {
      const labelsGroup = this.chartGroup.append('g');
      Array.entries(Object.entries(this.yOptions)).forEach(([index, [key, value]]) => {
        labelsGroup.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - this.svgParams.left)
          .attr('x', 0 - this.height / 2)
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
      return labelsGroup;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
