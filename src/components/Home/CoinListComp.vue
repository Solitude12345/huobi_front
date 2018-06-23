<template>
  <div class="comp-coin-list">
      <el-tabs v-model="activeBaseCoin" type="card">
        <el-tab-pane v-for="(obj, baseCoin) in allPairSymbols || initSymbols"
                     :name="baseCoin"
                     :key="baseCoin">
          <div slot="label" class="tab-label">
            <img width="22"
                 height="22"
                 class="mr-10"
                 :src="`https://www.huobipro.com/home/${baseCoin.toLowerCase()}.svg`" alt="">
            {{baseCoin}}
          </div>
          <div class="border">
            <div class="head-table pr-6">
              <table>
                <colgroup>
                  <col class="w15">
                  <col class="w15">
                  <col class="w15">
                  <col class="w15">
                  <col class="w15">
                  <col class="w15">
                </colgroup>
                <tr>
                  <th>交易对</th>
                  <th>最新价</th>
                  <th>涨幅</th>
                  <th>最高价</th>
                  <th>最低价</th>
                  <th>24H量</th>
                </tr>
              </table>
            </div>
            <div class="body-table-wrap">
              <table class="body-table">
                <colgroup>
                  <col class="w15">
                  <col class="w15">
                  <col class="w15">
                  <col class="w15">
                  <col class="w15">
                  <col class="w15">
                </colgroup>
                <tr v-for="(mkt, targetCoin) in  obj"
                    :key="targetCoin"
                    @click="toExchange({baseCoin, targetCoin})"
                    class="table-row">
                  <td>{{targetCoin}} <span class="color-weak">/ {{baseCoin}}</span></td>
                  <td>
                    <obvious-price-comp :value="mkt.close | sliceTo(8)" />
                  </td>
                  <td>
                    <span :class="mkt | changeClass">
                      {{(mkt.close / mkt.open -1) * 100 | signed}}%
                      <i :class="mkt | arrows"></i>
                    </span>
                  </td>
                  <td>
                    <obvious-price-comp :value="mkt.high | sliceTo(8)" />
                  </td>
                  <td>
                    <obvious-price-comp :value="mkt.low | sliceTo(8)" />
                  </td>
                  <td>
                    {{mkt.amount | sliceTo(0)}} <span class="color-weak">{{targetCoin}}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import ObviousPriceComp from '@c/ObviousPriceComp'
import {createNamespacedHelpers} from 'vuex'
const {mapState, mapMutations} = createNamespacedHelpers('pairs')

export default {
  name: "coin-list-comp",
  components: {ObviousPriceComp},
  data () {
    return {
      favoritePairs: [],
      activeBaseCoin: 'USDT'
    }
  },
  computed: {
    ...mapState([
      'allPairSymbols'
    ])
  },
  filters: {
    getTargetCoin (symbol, baseCoin) {
      return symbol
        ? symbol.slice(0, symbol.lastIndexOf(baseCoin.toLowerCase())).toUpperCase()
        : '--'
    },
    arrows (mkt) {
      let {close, open} = mkt
      if (close > open) return 'el-icon-caret-top'
      else if (close < open) return 'el-icon-caret-bottom'
      else return ''
    }
  },
  methods: {
    toExchange ({baseCoin, targetCoin}) {
      this.updateKlineSymbol({
        baseCoin,
        targetCoin
      })
      this.$router.push({
        name: 'Pairs'
      })
    },
    ...mapMutations([
      'updateKlineSymbol'
    ])
  }
}
</script>

<style scoped>
  .comp-coin-list {
    padding: 30px;
  }
  .tab-label {
    padding: 0 20px;
    color: #c7cce6;
  }
  .el-tabs__item.is-active .tab-label {
    color: #7a98f7;
  }
  .border {
    border: 1px solid #4e5b85;
  }
  .body-table-wrap{
    max-height: 550px;
    overflow-y: auto;
    text-align: center;
  }
  .body-table-wrap tr {
    background-color: #202437;
    box-shadow:0 0 1px hsla(231,9%,54%,.2);
    cursor: pointer;
  }
  .body-table-wrap tr:hover {
    background-color: #1b1e2e;
  }
  .table-row>td:first-child,th:first-child{
    padding-left: 30px;
    text-align: left;
  }
  .table-row>td:last-child,th:last-child{
    padding-right: 30px;
    text-align: right;
  }
  th,td{
    line-height: 35px;
  }
</style>
<!--<style>-->
  <!--.comp-coin-list .el-table__body-wrapper {-->
    <!--overflow-y: auto;-->
    <!--max-height: 600px;-->
  <!--}-->
<!--</style>-->
