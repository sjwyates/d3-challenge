<template>
  <div id="app">
    <SVGContainer :svgParams="svgParams" :census-data="censusData"/>
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
        width: 1000, height: 560, top: 20, right: 40, bottom: 140, left: 100,
      },
      error: undefined,
    };
  },
  methods: {
    async fetchCSV() {
      try {
        this.censusData = await csv('http://localhost:8080/data.csv');
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
