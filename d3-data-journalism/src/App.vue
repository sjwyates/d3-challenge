<template>
  <div id="app">
    <SVGContainer/>
  </div>
</template>

<script>
import { csv } from 'd3-fetch';
import SVGContainer from './components/SVG-Container.vue';

export default {
  name: 'App',
  components: {
    SVGContainer,
  },
  data() {
    return {
      censusData: [],
      x: 'poverty',
      y: 'obesity',
      xOptions: { poverty: 'In Poverty (%)', age: 'Age (Median)', income: 'Household Income (Median)' },
      yOptions: { obesity: 'Obese (%)', smokes: 'Smokes (%)', healthcare: 'Lacks Healthcare (%)' },
      svg: {
        width: 960, height: 500, top: 20, right: 40, bottom: 80, left: 100,
      },
      baseUrl: 'http://localhost:8080/',
      error: undefined,
    };
  },
  computed: {
    chartData() {
      return {
        xTitle: this.xOptions[this.x],
        yTitle: this.yOptions[this.y],
        data: this.censusData.map((state) => ({
          state: state.state,
          abbr: state.abbr,
          x: +state[this.x],
          y: +state[this.y],
        })),
      };
    },
  },
  methods: {
    async fetchCSV() {
      try {
        const data = await csv('http://localhost:8080/data.csv');
        this.censusData = data;
      } catch (err) {
        this.error = err;
      }
    },
  },
  created() {
    this.fetchCSV();
  },
};
</script>

<style lang="scss">
</style>
