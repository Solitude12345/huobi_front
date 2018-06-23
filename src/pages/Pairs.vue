<template>
  <div id="page-pairs">
    <div class="pd-10 clear-fix">
      <div class="fl w22 pr-10 border-box">
        <pairs-info-comp></pairs-info-comp>
        <news-comp></news-comp>
      </div>
      <div class="fl w78">
        <kline-comp :base-coin="baseCoin"
                    :target-coin="targetCoin" />
        <div class="clear-fix">
          <div class="w68 fl pr-10 border-box">
            <operation-comp :base-coin="baseCoin"
                            :target-coin="targetCoin" />
          </div>
          <div class="w32 fr">
            <market-depth-comp
              :base-coin="baseCoin"
              :target-coin="targetCoin" />
          </div>
        </div>
        <div class="clear-fix">
          <div class="fl w60 pr-10 border-box">
            <depth-char-comp
              :base-coin="baseCoin"
              :target-coin="targetCoin" />
          </div>
          <div class="fr w40">
            <trades-list-comp
              :base-coin="baseCoin"
              :target-coin="targetCoin" />
          </div>
        </div>
        <coin-info-comp :target-coin="targetCoin" />
      </div>
    </div>
  </div>
</template>

<script>
import CoinInfoComp from '@c/Pairs/CoinInfoComp'
import DepthCharComp from '@c/Pairs/DepthCharComp'
import KlineComp from '@c/Pairs/KlineComp'
import MarketDepthComp from '@c/Pairs/MarketDepthComp'
import NewsComp from '@c/Pairs/NewsComp'
import OperationComp from '@c/Pairs/OperationComp'
import PairsInfoComp from '@c/Pairs/PairsInfoComp'
import TradesListComp from '@c/Pairs/TradesListComp'

export default {
  name: "pairs",
  components: {
    CoinInfoComp,
    DepthCharComp,
    KlineComp,
    MarketDepthComp,
    NewsComp,
    OperationComp,
    PairsInfoComp,
    TradesListComp,
  },
  data () {
    return {
      baseCoin: 'USDT',
      targetCoin: 'BTC'
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created () {
  }
}
</script>

<style>
  #page-pairs .block-height{
    height: 385px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .w32{
    width: 32%;
  }
  .w68{
    width: 68%;
  }
  .w22{
    width: 22%;
  }
  .w78{
    width: 78%;
  }
</style>
