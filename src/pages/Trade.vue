<template>
  <div id="page-trade">
    <div class="main-box clear-fix">
      <div class="fl w20 pr-30 border-box">
        <coin-list-comp />
      </div>
      <div class="fr w80">
        <trade-user-info-comp/>
        <entrust-list-comp class="mt-15 mb-30" />
        <user-trade-orders-comp />
      </div>
    </div>
  </div>
</template>

<script>
import CoinListComp from '@c/Trade/CoinListComp'
import TradeUserInfoComp from '@c/Trade/TradeUserInfoComp'
import EntrustListComp from '@c/Trade/EntrustListComp'
import UserTradeOrdersComp from '@c/Trade/UserTradeOrdersComp'
export default {
  name: "trade",
  components: {
    CoinListComp,
    TradeUserInfoComp,
    EntrustListComp,
    UserTradeOrdersComp
  },
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
  methods: {}
}
</script>

<style scoped>
  #page-trade{
    background: #fcfcfc;
    color: #262a42;
    padding: 40px 0;
  }
  .main-box{
    width: 1200px;
    margin: 0 auto;
  }
</style>
