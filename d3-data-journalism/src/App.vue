<template>
  <div id="app">
    <SVGContainer :svgParams="svgParams" :chart-data="chartData" :x="x" :y="y"/>
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
      x: 'poverty',
      y: 'obesity',
      censusData: [],
      svgParams: {
        width: 960, height: 500, top: 20, right: 40, bottom: 80, left: 100,
      },
      error: undefined,
    };
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
