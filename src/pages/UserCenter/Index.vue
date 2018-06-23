<template>
  <div id="page-user-center" class="page-container">
    <div class="cont-box page-title">
      {{$route.name}}
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "user-center",
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created () {
  }
}
</script>

<style>
  #page-user-center .cont-title{
    font-size: 16px;
    line-height: 48px;
    padding: 0 30px;
    margin: 0 -30px;
  }
</style>
