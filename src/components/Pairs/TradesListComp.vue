<template>
  <div class="cont-box">
    <div class="cont-title">实时成交</div>
    <div class="block-height tbody-wrap">
      <table class="w100">
        <colgroup>
          <col class="w25">
          <col class="w25">
          <col class="w25">
          <col class="w25">
        </colgroup>
        <tbody>
        <tr class="color-weak">
          <td>时间</td>
          <td>方向</td>
          <td>价格({{baseCoin}})</td>
          <td>数量({{targetCoin}})</td>
        </tr>
        <tr v-for="(order,idx) in list" :key="idx">
          <td>{{new Date(order.ts).toTimeString().slice(0, 8)}}</td>
          <td>
            <span :class="order.direction | directionClass">
              {{order.direction | directionText}}
            </span>
          </td>
          <td>
            <obvious-price-comp :value="order.price | sliceTo(8)" />
          </td>
          <td>
            <obvious-price-comp :value="order.amount | sliceTo(4)" />
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
  name: "trades-list-comp",
  components: {ObviousPriceComp},
  data () {
    return {
      list: []
    }
  },
  computed: {
    ...mapState([
      'baseCoin',
      'targetCoin'
    ]),
    ...mapGetters([
      'klineSymbol'
    ])
  },
  filters: {
    directionText (buyOrSell) {
      return {
        buy: '买',
        sell: '卖'
      }[buyOrSell]
    },
    directionClass (buyOrSell) {
      return {
        buy: ['color-buy'],
        sell: ['color-sell']
      }[buyOrSell]
    }
  },
  watch: {
    klineSymbol: {
      handler: 'init',
      immediate: true
    }
  },
  methods: {
    async init () {
      this.list = []
      let res = await wsBus.reqTradDetail()
      this.list = res
      wsBus.$on('marketTradeDetail', data => {
        data.forEach(o => {
          this.list.unshift(o)
          this.list.pop()
        })
      })
    }
  }
}
</script>

<style scoped>
.tbody-wrap{
  line-height: 22px;
  text-align: center;
  font-size: 12px;
  padding: 5px 0;
}
</style>
