<template>
  <div class="pairs-order-form">
    <el-form size="medium">
      <el-form-item :label="formLabel.price">
        <el-input class="order-price">
          <span slot="suffix">
            <span class="color-weak pr-10">{{baseCoin}}</span>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item :label="formLabel.amount">
        <el-input>
          <span slot="suffix">
            <span class="color-weak pr-10">{{targetCoin}}</span>
          </span>
        </el-input>
      </el-form-item>
      <slider-comp></slider-comp>
      <div class="mb-25">
        <div class="clear-fix font-12" v-if="buyOrSell==='buy'">
          <span class="fl">0 {{baseCoin}}</span>
          <span class="fr">0.0000 {{baseCoin}}</span>
        </div>
        <div class="clear-fix font-12" v-else>
          <span class="fl">0 {{targetCoin}}</span>
          <span class="fr">0.0000 {{targetCoin}}</span>
        </div>
      </div>
      <el-form-item>
        <div>交易额 0.00000000 {{baseCoin}}</div>
      </el-form-item>
      <el-form-item>
        <a  class="order-btn" :class="bgColor">{{formLabel.type}} {{targetCoin}}</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SliderComp from '@c/Pairs/SliderComp'
import {createNamespacedHelpers} from 'vuex'
const {mapState} = createNamespacedHelpers('pairs')

export default {
  name: "limit-price-form-comp",
  components: {SliderComp},
  props: [
    'buyOrSell'
  ],
  data () {
    return {
      formData: {
      }
    }
  },
  computed: {
    formLabel () {
      switch (this.buyOrSell) {
        case 'buy':
          return {
            type: '买入',
            price: '买入价',
            amount: '买入量'
          }
        case 'sell':
          return {
            type: '卖出',
            price: '卖出价',
            amount: '卖出量'
          }
      }
    },
    bgColor () {
      switch (this.buyOrSell) {
        case 'buy':
          return 'bg-buy'
        case 'sell':
          return 'bg-sell'
      }
    },
    ...mapState([
      'baseCoin',
      'targetCoin'
    ])
  },
  watch: {},
  methods: {
  },
  created () {
  }
}
</script>

<style scoped>
</style>
