<template>
  <ul class="coin-list">
    <router-link
      tag="li"
      :to="{name: 'Trade', params: {coin}}"
      v-for="coin in coins"
      :key="coin">
      {{coin}}</router-link>
  </ul>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "coin-list-comp",
  data () {
    return {
      coins: []
    }
  },
  computed: {
    ...mapState('user', [
      'legalBalance'
    ])
  },
  watch: {},
  methods: {},
  async created () {
    let res = await this.$tipPost('/v1/c2c/placard/coin')
    if (res._statusOk) this.coins = res.data
  }
}
</script>

<style scoped>
  .coin-list{
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    min-height: 350px;
  }
  .coin-list>li{
    padding: 10px 20px;
    transition: .2s;
    cursor: pointer;
    background-color: transparent;
    border-bottom: 1px solid whitesmoke;
    border-left: 3px solid transparent;
  }
  .coin-list>.router-link-exact-active{
    border-left-color: #7a98f7;
    box-shadow: 2px 0 4px #7a98f7 inset;
  }
  .coin-list>li:hover{
    background-color: #f5f5f5;
  }
</style>
