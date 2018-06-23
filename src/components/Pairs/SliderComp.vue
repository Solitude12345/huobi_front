<template>
  <div>
    <div class="ph-5">
      <el-slider v-model="sliderVal"
                 :format-tooltip="sliderFormat"
      ></el-slider>
      <div class="relative">
        <a
           class="stop stop-0 active"
           @click="sliderVal=0"></a>
        <a
           class="stop stop-1"
           :class="{active: sliderVal>=25}"
           @click="sliderVal=25"></a>
        <a
           class="stop stop-2"
           :class="{active: sliderVal>=50}"
           @click="sliderVal=50"></a>
        <a
           class="stop stop-3"
           :class="{active: sliderVal>=75}"
           @click="sliderVal=75"></a>
        <a  class="stop stop-4" @click="sliderVal=100"></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "slider-comp",
  data () {
    return {
      sliderVal: 0
    }
  },
  computed: {},
  watch: {},
  methods: {
    sliderFormat (n) {
      return n + '%'
    }
  },
  created () {
  }
}
</script>

<style scoped>
  .stop{
    z-index: 99;
    color: #c7cce6;
    display: inline-block;
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #262a42;
    transform: translate(-5px);
    top: -23px;
  }
  .stop-0{
    left: 0;
  }
  .stop-1{
    left: 25%;
  }
  .stop-2{
    left: 50%;
  }
  .stop-3{
    left: 75%;
  }
  .stop-4{
    left: 100%;
  }
  .stop.active{
    background-color: #4e5b85;
  }
</style>
