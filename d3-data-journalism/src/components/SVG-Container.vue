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
          <text v-for="(option, index) in xOptions"
                :key="option.name"
                class="axis-text"
                :class="{active: x === option.name}"
                @click="x = option.name"
                text-anchor="middle"
                x="0"
                :y="(index + 1) * 20">
            {{ option.axisTitle }}
          </text>
        </g>
        <g class="y-label-group" :style="cssVars">
          <text v-for="(option, index) in yOptions"
                :key="option.name"
                class="axis-text"
                :class="{active: y === option.name}"
                @click="y = option.name"
                transform="rotate(-90)"
                text-anchor="middle"
                :x="0 - svgHeight / 2"
                :y="0 - svgParams.left"
                :dy="index + 2 + 'em'">
            {{ option.axisTitle }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { select, selectAll } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
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
    setAxes() {
      const bottomAxis = axisBottom(this.xScale);
      const leftAxis = axisLeft(this.yScale);
      const xAxis = select('.chart-group')
        .append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${this.svgHeight})`)
        .call(bottomAxis);
      const yAxis = select('.chart-group')
        .append('g')
        .classed('y-axis', true)
        .call(leftAxis);
      return { xAxis, yAxis };
    },
    circles() {
      return selectAll('.circle')
        .data(this.chartData.data)
        .enter()
        .attr('cx', (d) => this.xScale(d.x))
        .attr('cy', (d) => this.yScale(d.y));
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
        .domain(extent(this.chartData, (d) => d.x))
        .range([0, this.svgWidth]);
    },
    yScale() {
      return scaleLinear()
        .domain(extent(this.chartData, (d) => d.y))
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.axis-text {
  cursor: pointer;
  font-weight: lighter;
}
.active {
  font-weight: bold;
}
</style>
