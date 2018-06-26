<template>
  <div id="app">
    <navbar-comp :class="navbarClass"></navbar-comp>
    <div id="page-main">
      <router-view/>
    </div>
    <footer-comp></footer-comp>
    <transition name="fade">
      <div id="err-tip"
           v-show="errMsg"
           v-text="errMsg"></div>
    </transition>
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
    },
    errMsg () {
      return this.$store.state.errMsg
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
    this.$store.dispatch('user/getBalance')
    this.$store.dispatch('user/getUserInfo')
  }
}
</script>

<style>
  .home-navbar{
    position: absolute;
    z-index: 5;
    top: 0;
    background-color: rgba(0, 0, 0, .1) !important;
  }
  #err-tip{
    min-width: 300px;
    border-radius: 10px;
    background: rgba(0,0,0,.6);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    padding: 30px 20px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    line-height: 30px;
    z-index: 9999;
    box-shadow: 0 0 5px #000;
  }
</style>
