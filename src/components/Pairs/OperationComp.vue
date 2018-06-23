<template>
  <div class="cont-box">
    <div class="cont-title pb-0">
      <span class="link"
            @click="priceType='limit'"
            :class="{'is-active': priceType==='limit'}">限价交易</span>
      <span class="link"
            @click="priceType='market'"
            :class="{'is-active': priceType==='market'}">市价交易</span>
    </div>
    <div class="clear-fix ph-15 pt-25 block-height">
      <div class="fl w50 pr-15 border-box">
        <limit-price-form-comp v-if="priceType==='limit'"
                          buy-or-sell="buy" />
        <market-price-form-comp v-if="priceType==='market'"
                          buy-or-sell="buy" />
      </div>
      <div class="fr w50 pl-15 border-box">
        <limit-price-form-comp v-if="priceType==='limit'"
                          buy-or-sell="sell" />
        <market-price-form-comp v-if="priceType==='market'"
                          buy-or-sell="sell" />
      </div>
    </div>
  </div>
</template>

<script>
import LimitPriceFormComp from '@c/Pairs/LimitPriceFormComp'
import MarketPriceFormComp from '@c/Pairs/MarketPriceFormComp'
import {createNamespacedHelpers} from 'vuex'
const {mapState} = createNamespacedHelpers('pairs')
export default {
  name: "operation-comp",
  components: {
    LimitPriceFormComp,
    MarketPriceFormComp
  },
  data () {
    return {
      priceType: 'limit'
    }
  },
  computed: {
    ...mapState([
      // 'baseCoin',
      // 'targetCoin'
    ])
  },
  watch: {},
  methods: {},
  created () {
  }
}
</script>

<style scoped>
.link{
  padding-bottom: 14px;
}
</style>
<style>
  /*
   * limit-order-form-comp market-order-form-comp
   */
  .pairs-order-form .order-btn {
    display: block;
    color: #c7cce6;
    border-radius: 3px;
    text-align: center;
    transition: .2s;
  }
  .pairs-order-form .order-btn.bg-buy:hover{
    background-color: rgba(88,144,101,.9);
  }
  .pairs-order-form .order-btn.bg-buy:active{
    background-color: rgba(88,144,101,.7);
  }

  .pairs-order-form .order-btn.bg-sell:hover{
    background-color: rgba(174,78,84,.9);
  }
  .pairs-order-form .order-btn.bg-sell:active{
    background-color: rgba(174,78,84,.7);
  }
  .pairs-order-form .el-input--suffix .el-input__inner{
    padding-right: 60px;
    background-color: #1e2235;
  }
</style>
