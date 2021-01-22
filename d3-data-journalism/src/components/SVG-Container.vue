<template>
  <div class="svg-container">
    <svg id="svg" :width="svgParams.width" :height="svgParams.height">
      <g class="chart-group" :transform="transform.chartGroup">
<!--        <circle v-for="state in chartData"-->
<!--                :key="state.abbr + '-c'"-->
<!--                class="circle"-->
<!--                r="20"-->
<!--                fill="blue"-->
<!--                opacity="0.5">-->
<!--        </circle>-->
        <g class="x-label-group"
            :transform="transform.xLabels">
<!--          <text v-for="(option, index) in xOptions"-->
<!--                :key="option.name"-->
<!--                class="axis-text"-->
<!--                :class="{active: x === option.name, inactive: x !== option.name}"-->
<!--                @click="updateAxis('x', option.name)"-->
<!--                text-anchor="middle"-->
<!--                x="0"-->
<!--                :y="(index + 1) * 20">-->
<!--            {{ option.axisTitle }}-->
<!--          </text>-->
        </g>
        <g class="y-label-group" :style="cssVars">
<!--          <text v-for="(option, index) in yOptions"-->
<!--                :key="option.name"-->
<!--                class="axis-text"-->
<!--                :class="{active: y === option.name, inactive: y !== option.name}"-->
<!--                @click="updateAxis('y', option.name)"-->
<!--                transform="rotate(-90)"-->
<!--                text-anchor="middle"-->
<!--                :x="0 - svgHeight / 2"-->
<!--                :y="0 - svgParams.left"-->
<!--                :dy="index + 2 + 'em'">-->
<!--            {{ option.axisTitle }}-->
<!--          </text>-->
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';
import * as tip from 'd3-tip';

export default {
  name: 'SVGContainer',
  props: {
    censusData: Array,
    svgParams: Object,
  },
  data() {
    return {
      x: 'poverty',
      y: 'obesity',
      xOptions: [
        {
          name: 'poverty', axisTitle: 'In Poverty (%)', ttTitle: 'Poverty', ttUnits: ' %',
        },
        {
          name: 'age', axisTitle: 'Age (Median)', ttTitle: 'Age', ttUnits: '',
        },
        {
          name: 'income', axisTitle: 'Household Income (Median)', ttTitle: 'Income', ttUnits: '',
        },
      ],
      yOptions: [
        {
          name: 'obesity', axisTitle: 'Obese (%)', ttTitle: 'Obesity', ttUnits: ' %',
        },
        {
          name: 'smokes', axisTitle: 'Smokes (%)', ttTitle: 'Smokes', ttUnits: ' %',
        },
        {
          name: 'healthcare', axisTitle: 'Lacks Healthcare (%)', ttTitle: 'Healthcare', ttUnits: ' %',
        },
      ],
      axes: null,
      circles: null,
    };
  },
  methods: {
    init() {
      let bottomAxis = axisBottom(this.xScale);
      let leftAxis = axisLeft(this.yScale);
      const xAxis = select('.chart-group')
        .append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${this.svgHeight})`)
        .call(bottomAxis);
      const yAxis = select('.chart-group')
        .append('g')
        .classed('y-axis', true)
        .call(leftAxis);
      const circlesGroup = select('.chart-group')
        .selectAll('circle')
        .data(this.chartData)
=======
      return { xAxis, yAxis };
    },
    circles() {
      return selectAll('.circle')
        .data(this.chartData.data)
>>>>>>> parent of 7e13b8f (we have circles)
        .enter()
        .attr('cx', (d) => this.xScale(d.x))
<<<<<<< HEAD
        .attr('cy', (d) => this.yScale(d.y))
        .attr('r', 10)
        .attr('fill', '#89bdd3')
        .attr('stroke', '#e3e3e3')
        .attr('opacity', '.5');
      const toolTip = tip.default()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function tipText(d) {
          const xText = `${this.xOptions[this.x].ttTitle}: ${d.x}${this.xOptions[this.x].ttUnits}`;
          const yText = `${this.xOptions[this.y].ttTitle}: ${d.y}${this.xOptions[this.y].ttUnits}`;
          return (`${d.state}<hr>${xText}<br>${yText}`);
        });
      circlesGroup.call(toolTip)
        .on('mouseover', (data) => toolTip.show(data))
        .on('mouseout', (data) => toolTip.hide(data));
      const xLabelGroup = select('.x-label-group');
      this.xOptions.forEach((option, index) => {
        xLabelGroup.append('text')
          .attr('x', 0)
          .attr('y', (index + 1) * 20)
          .attr('value', option.name)
          .classed('active', this.x === option.name)
          .classed('inactive', this.x !== option.name)
          .text(option.axisTitle)
          .on('click', () => {
            if (this.x !== option.name) {
              xLabelGroup.selectAll('text')
                .classed('active', false)
                .classed('inactive', true);
              xLabelGroup.select(`#${option.name}`)
                .classed('active', true);
              bottomAxis = axisBottom(this.xScale);
              const t = transition()
                .duration(1000);
              xAxis
                .transition(t)
                .call(bottomAxis);
              circlesGroup
                .transition(t)
                .attr('cx', (d) => this.xScale(d.x))
                .attr('cy', (d) => this.yScale(d.y));
              toolTip
                .html(function tipText(d) {
                  const xText = `${this.xOptions[this.x].ttTitle}: ${d.x}${this.xOptions[this.x].ttUnits}`;
                  const yText = `${this.xOptions[this.y].ttTitle}: ${d.y}${this.xOptions[this.y].ttUnits}`;
                  return (`${d.state}<hr>${xText}<br>${yText}`);
                });
            }
          });
      });
      const yLabelGroup = select('.y-label-group');
      this.xOptions.forEach((option, index) => {
        yLabelGroup.append('text')
          .attr('x', 0 - this.svgParams.left)
          .attr('y', 0 - this.svgHeight / 2)
          .attr('dy', `${index + 2}em`)
          .attr('value', option.name)
          .classed('active', this.y === option.name)
          .classed('inactive', this.y !== option.name)
          .text(option.axisTitle)
          .on('click', () => {
            if (this.y !== option.name) {
              yLabelGroup.selectAll('text')
                .classed('active', false)
                .classed('inactive', true);
              yLabelGroup.select(`#${option.name}`)
                .classed('active', true);
              leftAxis = axisLeft(this.yScale);
              const t = transition()
                .duration(1000);
              yAxis
                .transition(t)
                .call(leftAxis);
              circlesGroup
                .transition(t)
                .attr('cx', (d) => this.xScale(d.x))
                .attr('cy', (d) => this.yScale(d.y));
              toolTip
                .html(function tipText(d) {
                  const xText = `${this.xOptions[this.x].ttTitle}: ${d.x}${this.xOptions[this.x].ttUnits}`;
                  const yText = `${this.xOptions[this.y].ttTitle}: ${d.y}${this.xOptions[this.y].ttUnits}`;
                  return (`${d.state}<hr>${xText}<br>${yText}`);
                });
            }
          });
      });
=======
        .attr('cy', (d) => this.yScale(d.y));
>>>>>>> parent of 7e13b8f (we have circles)
    },
  },
  computed: {
    chartData() {
      return this.censusData.map((state) => ({
        state: state.state,
        abbr: state.abbr,
        x: +state[this.x],
        y: +state[this.y],
      }));
    },
    svgWidth() {
      return this.svgParams.width - this.svgParams.left - this.svgParams.right;
    },
    svgHeight() {
      return this.svgParams.height - this.svgParams.top - this.svgParams.bottom;
    },
    xScale() {
      return scaleLinear()
        .domain([min(this.chartData, (d) => d.x) * 0.95,
          max(this.chartData, (d) => d.x) * 1.05])
        .range([0, this.svgWidth]);
    },
    yScale() {
      return scaleLinear()
        .domain([min(this.chartData, (d) => d.y) * 0.95,
          max(this.chartData, (d) => d.y) * 1.05])
        .range([this.svgHeight, 0]);
    },
    transform() {
      return {
        chartGroup: `translate(${this.svgParams.left}, ${this.svgParams.right})`,
        xLabels: `translate(${this.svgWidth / 2}, ${this.svgHeight + 30})`,
      };
    },
    cssVars() {
      return {
        '--svg-width': `${this.svgWidth}px`,
        '--svg-height': `${this.svgHeight}px`,
      };
    },
  },
  mounted() {
<<<<<<< HEAD
    this.axes = this.init();
=======
    this.setAxes();
    // this.circles();
  },
  beforeUpdate() {
    selectAll('.tick').remove();
    selectAll('.tick').remove();
  },
  updated() {
    this.setAxes();
    // this.circles();
>>>>>>> parent of 7e13b8f (we have circles)
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.inactive {
  cursor: pointer;
  font-weight: lighter;
  &:hover {
    font-weight: normal;
  }
}
.active {
  cursor: default;
  font-weight: bold;
}
</style>
