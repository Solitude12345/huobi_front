<template>
  <div class="pairs-order-form">
    <el-form size="medium">
      <el-form-item :label="formLabel.price">
        <el-input class="order-price not-input" readonly :value="`以市场上最优价格${formLabel.type}`">
          <span slot="suffix">
            <span class="color-weak pr-10">{{baseCoin}}</span>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item :label="formLabel.amount">
        <el-input>
          <span slot="suffix">
            <span class="color-weak pr-10">{{orderCoin}}</span>
          </span>
        </el-input>
      </el-form-item>
      <slider-comp></slider-comp>
      <div class="mb-25">
        <div class="clear-fix font-12" v-if="buyOrSell==='buy'">
          <span class="fl">0 {{baseCoin}}</span>
          <span class="fr">0.00000000 {{baseCoin}}</span>
        </div>
        <div class="clear-fix font-12" v-else>
          <span class="fl">0 {{targetCoin}}</span>
          <span class="fr">0.00000000 {{targetCoin}}</span>
        </div>
      </div>
      <el-form-item>
        <div class="line-holder"></div>
      </el-form-item>
      <el-form-item>
        <a class="order-btn"
           :class="bgColor">{{formLabel.type}} {{targetCoin}}</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SliderComp from '@c/Pairs/SliderComp'
import {createNamespacedHelpers} from 'vuex'
const {mapState} = createNamespacedHelpers('pairs')

export default {
  name: "market-price-form-comp",
  components: {SliderComp},
  props: [
    'buyOrSell'
  ],
  data () {
    return {
      formData: {
      },
      formLabel: null,
      bgColor: ''
    }
  },
  computed: {
    orderCoin () {
      switch (this.buyOrSell) {
        case 'buy':
          return this.baseCoin
        case 'sell':
          return this.targetCoin
      }
    },
    ...mapState([
      'baseCoin',
      'targetCoin'
    ])
  },
  watch: {
    buyOrSell: {
      handler (BorS) {
        switch (BorS) {
          case 'buy':
            this.formLabel = {
              type: '买入',
              price: '买入价',
              amount: '交易额'
            }
            this.bgColor = 'bg-buy'
            break
          case 'sell':
            this.formLabel = {
              type: '卖出',
              price: '卖出价',
              amount: '卖出量'
            }
            this.bgColor = 'bg-sell'
        }
      },
      immediate: true
    }
  },
  methods: {

  },
  created () {
  }
}
</script>

<style scoped>
.line-holder{
  height: 36px;
}
</style>
<style>
  .not-input .el-input__inner{
    border-color: transparent !important;
    color: #61688a;
  }
</style>
