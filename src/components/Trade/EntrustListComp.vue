<template>
  <div class="entrust-list-comp">
    <div class="text-right pb-5">
      价格不合适？<a class="color-primary">发布交易单</a>
    </div>
    <div class="divider"></div>
    <div class="entrust-table">
      <div class="head-table pv-5 pr-15">
        <table>
          <colgroup>
            <col class="w5">
            <col class="w5">
            <col class="w10">
            <col class="w10">
            <col class="w15">
            <col class="w10">
            <col class="w10">
            <col class="w5">
          </colgroup>
          <tr>
            <th class="text-center">排位</th>
            <th>价格(CNY)</th>
            <th>数量(USDT)</th>
            <th>所有金额</th>
            <th>委托人/单数/完成率</th>
            <th>单笔限额</th>
            <th class="pay-method-cell">支付方式</th>
            <th class="text-left">下单</th>
          </tr>
        </table>
      </div>
      <div class="body-table">
        <div id="asks-wrap" ref="asksWrap">
          <table>
            <colgroup>
              <col class="w5">
              <col class="w5">
              <col class="w10">
              <col class="w10">
              <col class="w15">
              <col class="w10">
              <col class="w10">
              <col class="w5">
            </colgroup>
            <tr v-for="(o, idx) in asks" :key="o.id">
              <td class="color-sell text-center">{{asks.length - idx}}</td>
              <td>{{o.price}}</td>
              <td>{{o.tradeCount | sliceTo(2)}}</td>
              <td>{{calcTotal(o.price, o.tradeCount) | sliceTo(2)}}</td>
              <td>{{o.userName}} ({{o.tradeMonthTimes}} / {{o.orderCompleteRate}}%)</td>
              <td>{{o.minTradeLimit}}-{{o.maxTradeLimit}}</td>
              <td class="pay-method-cell">
                <img v-for="n in o.payMethod.split(',')"
                     :key="n"
                     :src="n | payMethodIcon" alt="">
              </td>
              <td class="text-left">
                <a class="btn-buy color-buy">买入</a>
              </td>
            </tr>
          </table>
        </div>

        <div id="bids-wrap">
          <table>
            <colgroup>
              <col class="w5">
              <col class="w5">
              <col class="w10">
              <col class="w10">
              <col class="w15">
              <col class="w10">
              <col class="w10">
              <col class="w5">
            </colgroup>
            <tr v-for="(o, idx) in bids" :key="o.id">
              <td class="color-buy text-center">{{idx + 1}}</td>
              <td>{{o.price}}</td>
              <td>{{o.tradeCount | sliceTo(2)}}</td>
              <td>{{calcTotal(o.price, o.tradeCount) | sliceTo(2)}}</td>
              <td>{{o.userName}} ( {{o.tradeMonthTimes}} / {{o.orderCompleteRate}}%)</td>
              <td>{{o.minTradeLimit}}-{{o.maxTradeLimit}}</td>
              <td class="pay-method-cell">
                <img v-for="n in o.payMethod.split(',')"
                     :key="n"
                     :src="n | payMethodIcon" alt="">
              </td>
              <td class="text-left">
                <a class="btn-sell color-sell">卖出</a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: "entrust-list-comp",
  data () {
    return {
      asks: [],
      bids: [],
      needToBottom: true,
      interval: {
        getEntrustList: 0
      }
    }
  },
  computed: {},
  filters: {
    payMethodIcon (n) {
      switch (n) {
        case '1':
          return '/static/img/icon/bankcard.png'
        case '2':
          return '/static/img/icon/alipay.png'
        case '3':
          return '/static/img/icon/wechat.png'
      }
    }
  },
  watch: {},
  methods: {
    calcTotal (price, amount) {
      return price * Vue.filter('sliceTo')(amount, 2)
    },
    getEntrustList () {
      this.$get('https://otc-api.huobipro.com/v1/data/trade/list/public?country=37&currency=1&payMethod=0&currPage=1&coinId=2&tradeType=1&merchant=1&online=1')
        .then(res => {
          if (res.code === 200) {
            this.asks = res.data.reverse()
            this.needToBottom && this.$nextTick(() => {
              let box = this.$refs.asksWrap
              box.scrollTop = box.offsetHeight
              this.needToBottom = false
            })
          }
        })
      this.$get('https://otc-api.huobipro.com/v1/data/trade/list/public?country=37&currency=1&payMethod=0&currPage=1&coinId=2&tradeType=0&merchant=1&online=1')
        .then(res => {
          res.code === 200 && (this.bids = res.data)
          console.log(res)
        })
    }
  },
  async created () {
    this.getEntrustList()
    this.interval.getEntrustList = setInterval(this.getEntrustList, 10 * 1000)
  },
  beforeDestroy () {
    Object.values(this.interval).forEach(id => clearInterval(id))
  }
}
</script>

<style scoped>
/*th{*/
  /*font-weight: normal;*/
  /*color: gray;*/
  /*text-align: right;*/
/*}*/
.entrust-list-comp{
  font-size: 13px;
}
  .entrust-table{
    text-align: right;
  }
  .body-table{
    /*height: 456px;*/
    /*overflow-y: scroll;*/
    border: 1px solid #e9e9e9;
    border-radius: 3px;
  }
  #asks-wrap,#bids-wrap {
    height: 224px;
    overflow-y: scroll;
  }
  #asks-wrap{
    border-bottom: 1px solid #E0E0E0;
  }
  .head-table th {
    color: #aaaaaa;
    font-weight: normal;
  }
  .body-table tr{
    line-height: 30px;
  }
  .body-table tr:nth-child(odd) {
    background-color: #f5f5f5;
  }
  .color-buy{
    color: #4db872;
  }
  .color-sell{
    color:#ee6560;
  }
  .btn-buy,.btn-sell{
    border: 1px solid;
    border-radius: 3px;
    padding: 2px 15px;
    font-size: 12px;
  }
  .pay-method-cell{
    text-align: left;
    padding-left: 25px;
  }
  .pay-method-cell img{
    margin: 0 2px;
  }
</style>
