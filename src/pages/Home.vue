<template>
  <div id="page-home">
    <banners-comp></banners-comp>
    <line-news-comp></line-news-comp>
    <div class="ph-60 pv-30">
      <coin-list-comp></coin-list-comp>
    </div>
    <exchange-desc-comp></exchange-desc-comp>
    <entry-comp></entry-comp>
  </div>
</template>

<script>
import BannersComp from '@c/Home/BannersComp'
import LineNewsComp from '@c/Home/LineNewsComp'
import CoinListComp from '@c/Home/CoinListComp'
import ExchangeDescComp from '@c/Home/ExchangeDescComp'
import EntryComp from '@c/Home/EntryComp'
export default {
  name: "home",
  components: {
    BannersComp,
    LineNewsComp,
    CoinListComp,
    ExchangeDescComp,
    EntryComp
  }
}
</script>

<style scoped>
#page-home{
  margin-top: -56px;
}
</style>
