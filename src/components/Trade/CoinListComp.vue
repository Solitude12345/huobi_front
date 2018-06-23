<template>
  <ul class="coin-list">
    <li v-for="coin in coins" :key="coin">{{coin}}</li>
  </ul>
</template>

<script>
export default {
  name: "coin-list-comp",
  data () {
    return {
      coins: [
        'USDT',
        'BTC',
        'ETH',
        'ETC',
        'LTC',
        'EOS',
        'BCH',
        'QTUM',
        'NEO',
        'XUC',
      ]
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created () {
  }
}
</script>

<style scoped>
  .coin-list{
    border: 1px solid #e9e9e9;
    border-radius: 3px;
  }
  .coin-list>li{
    padding: 10px 20px;
    transition: .2s;
    cursor: pointer;
    background-color: transparent;
    border-bottom: 1px solid whitesmoke;
  }
  .coin-list>li:hover{
    background-color: #f5f5f5;
  }
</style>
