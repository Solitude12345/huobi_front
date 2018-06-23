<template>
  <div id="app">
    <navbar-comp :class="navbarClass"></navbar-comp>
    <div id="page-main">
      <router-view/>
    </div>
    <footer-comp></footer-comp>
  </div>
</template>

<script>
import NavbarComp from '@c/NavbarComp'
import FooterComp from '@c/FooterComp'

export default {
  name: 'App',
  components: {
    NavbarComp,
    FooterComp
  },
  data () {
    return {
      WS_URL: 'wss://api.huobi.pro/ws'
    }
  },
  computed: {
    navbarClass () {
      // switch (this.$route.name) {
      //   case 'Home':
      //     return 'home-navbar'
      //   case 'Pairs':
      //     return 'pairs-navbar'
      // }
      return this.$route.name === 'Home'
        ? 'home-navbar'
        : ''
    }
  },
  methods: {
  },
  async created () {
    // if (!window.WebSocket) {
    //   alert('浏览器不支持websocket!')
    // }
    // let res = await this.$get('https://api.huobipro.com/v1/common/symbols')
    // console.log(res)
    this.$store.dispatch('pairs/getAllSymbols')
    this.$store.dispatch('getBalance')
  }
}
</script>

<style>
#app {
}
  #page-main{
    /*margin-top: 56px;*/
  }
  .home-navbar{
    position: absolute;
    z-index: 5;
    top: 0;
    background-color: rgba(0, 0, 0, .1) !important;
  }
</style>
