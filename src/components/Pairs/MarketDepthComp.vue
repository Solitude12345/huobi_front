<template>
  <div class="cont-box">
    <div class="cont-title">最新价 {{currentPrice}} {{baseCoin}}</div>
    <div class="pv-10 ph-5 block-height">
      <table class="market-depth-table"
             cellpadding="0"
             cellspacing="0">
        <colgroup>
          <col class="w10">
          <col class="w25">
          <col class="w25">
          <col class="w25">
        </colgroup>
        <thead class="color-weak">
          <tr>
            <td></td>
            <td>价格({{baseCoin}})</td>
            <td>数量({{targetCoin}})</td>
            <td>总额({{baseCoin}})</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, idx) in asks" :key="idx">
            <td class="color-sell">卖 {{asks.length - idx}}</td>
            <td>
              <obvious-price-comp :value="order[0] | sliceTo(8)"></obvious-price-comp>
            </td>
            <td>
              <obvious-price-comp :value="order[1] | sliceTo(4)"></obvious-price-comp>
            </td>
            <td>
              <obvious-price-comp :value="order[0] * order[1] | sliceTo(4)"></obvious-price-comp>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="divider"></div>
      <table class="market-depth-table"
             cellpadding="0"
             cellspacing="0">
        <colgroup>
          <col class="w10">
          <col class="w25">
          <col class="w25">
          <col class="w25">
        </colgroup>
        <tbody>
          <tr v-for="(order, idx) in bids" :key="idx">
            <td class="color-buy">买 {{idx+1}}</td>
            <td>
              <obvious-price-comp :value="order[0] | sliceTo(8)"></obvious-price-comp>
            </td>
            <td>
              <obvious-price-comp :value="order[1] | sliceTo(4)"></obvious-price-comp>
            </td>
            <td>
              <obvious-price-comp :value="order[0] * order[1] | sliceTo(4)"></obvious-price-comp>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import wsBus from '@/assets/js/wsBus'
import ObviousPriceComp from '@c/ObviousPriceComp'
import {createNamespacedHelpers} from 'vuex'
const {mapState, mapGetters} = createNamespacedHelpers('pairs')

export default {
  name: "market-depth-comp",
  components: {
    ObviousPriceComp
  },
  data () {
    return {
      asks: [],
      bids: []
    }
  },
  computed: {
    currentPrice () {
      return 12345
    },
    ...mapState([
      'baseCoin',
      'targetCoin',
      'allPairSymbols'
    ]),
    ...mapGetters([
      'klineSymbol'
    ])
  },
  watch: {
    klineSymbol () {
      this.asks = []
      this.bids = []
    }
  },
  methods: {},
  created () {
    wsBus.$on('subscribeDepth', tick => {
      this.asks = tick.asks.slice(0, 7).reverse()
      this.bids = tick.bids.slice(0, 7)
    })
  }
}
</script>

<style scoped>
  .market-depth-table{
    width: 100%;
    text-align: right;
    font-size: 12px;
  }
  .market-depth-table td {
    line-height: 22px;
  }
  .divider {
    border-top-color: #1f2943;
    margin: 5px;
  }
</style>
