<template>
  <div class="page-container">
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
