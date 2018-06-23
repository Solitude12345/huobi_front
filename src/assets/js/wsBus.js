import Vue from 'vue'
import store from '@/store'
import * as pako from 'pako'
import {promiseBreaker} from "./tools";

const WS_URL = 'wss://api.huobi.pro/ws'

let wsBus = window.wsBus = new Vue({
  store,
  data: {
    ws: null,
    WS_URL: '',
    connectReady: promiseBreaker(), // 将是可外部决议的promise
    hasSubMktOverview: false
  },
  computed: {
    klineSymbol () { // 币币交易symbol
      return this.$store.getters['pairs/klineSymbol']
    }
  },
  watch: {
    klineSymbol (newSymbol, oldSymbol) {
      this.unsubscribe(oldSymbol)
      this.subscribe(newSymbol)
    }
  },
  methods: {
    init () {
      let ws = this.ws = new WebSocket(WS_URL);
      ws.onopen = () => {
        console.log('ws open');

        this.connectReady.resolve()
        this.subscribe(this.klineSymbol);
        // this.hasSubMktOverview && this.subMktOverView()
        this.subMktOverView()
      }
      ws.onmessage = (ev) => {
        let fileReader = new FileReader()
        fileReader.readAsArrayBuffer(ev.data)
        fileReader.onloadend = () => {
          let buffer8 = new Uint8Array(fileReader.result)
          let text = pako.inflate(buffer8, {
            to: 'string'
          })
          let msg = JSON.parse(text)
          // console.log(msg)
          if (msg.ping) {
            ws.send(JSON.stringify({
              pong: msg.ping
            }))
          } else if (msg.ch && msg.ch.startsWith(`market.${this.klineSymbol}.kline`)) {
            this.$emit('subscribeBar', msg.tick)
          } else if (msg.ch && msg.ch.startsWith(`market.${this.klineSymbol}.depth`)) {
            // console.log(msg)
            this.$emit('subscribeDepth', msg.tick)
          } else if (msg.id === `kline_${this.klineSymbol}_history`) {
            // console.log(msg)
            this.$emit('klineHistoryData', msg)
          } else if (msg.ch === `market.${this.klineSymbol}.detail`) {
            this.$emit('marketDetail', msg.tick)
          } else if (msg.ch === `market.${this.klineSymbol}.trade.detail`) {
            this.$emit('marketTradeDetail', msg.tick.data)
          } else if (msg.id === `market.${this.klineSymbol}.trade.detail`) {
            msg.status === 'ok' && this.$emit('marketTradeHistory', msg.data)
          } else if (msg.ch === 'market.overview') {
            store.commit('pairs/marketOverview', msg.data)
          } else {
            console.log(msg)
          }
        }
      }
      ws.onclose = () => {
        this.connectReady = promiseBreaker()
        console.log('ws close')
        this.init()
      }
      ws.onerror = err => {
        console.log('ws error', err);
        // this.init();
      }
    },
    subscribe (symbol) {
      // 订阅深度
      // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
      this.ws.send(JSON.stringify({
        "sub": `market.${symbol}.depth.step1`,
        "id": `market.${symbol}.depth`
      }))
      // 订阅实时数据
      this.ws.send(JSON.stringify({
        "sub": `market.${symbol}.kline.1min`,
        "id": `sub.market.${symbol}.kline`
      }))
      // 订阅detail
      this.ws.send(JSON.stringify({
        "sub": `market.${symbol}.detail`
      }))
      // 订阅tradeDetail
      this.ws.send(JSON.stringify({
        "sub": `market.${symbol}.trade.detail`
      }))
    },
    unsubscribe (symbol) {
      // 取消订阅
      // 市场深度
      this.ws.send(JSON.stringify({
        "unsub": `market.${symbol}.depth.step1`,
        "id": `unsub.market.${symbol}.depth`
      }))
      // K线
      this.ws.send(JSON.stringify({
        "unsub": `market.${symbol}.kline.1min`,
        "id": `unsub.market.${symbol}.kline`
      }))
      // detail
      this.ws.send(JSON.stringify({
        "unsub": `market.${symbol}.detail`
      }))
      // tradeDetail
      this.ws.send(JSON.stringify({
        "unsub": `market.${symbol}.trade.detail`
      }))
    },
    async reqKlinHistory (symbol, resolution, from, to) { // 请求k线历史数据
      await this.connectReady
      let period
      if (+resolution > 0) {
        period = resolution + 'min'
      } else {
        period = {
          D: '1day',
          W: '1week',
          M: '1mon',
          Y: '1year'
        }[resolution]
      }
      let res = await new Promise((resolve, reject) => {
        this.$once('klineHistoryData', (msg) => {
          resolve(msg)
        })
        this.ws.send(JSON.stringify({
          req: `market.${symbol}.kline.${period}`,
          id: `kline_${symbol}_history`,
          from: from,
          to: to
        }))
      })
      return res
    },
    async reqTradDetail () {
      await this.connectReady
      let res = await new Promise((resolve, reject) => {
        this.$once('marketTradeHistory', msg => {
          resolve(msg)
        })
        this.ws.send(JSON.stringify({
          "req": `market.${this.klineSymbol}.trade.detail`,
          id: `market.${this.klineSymbol}.trade.detail`
        }))
      })
      return res
    },
    async subMktOverView () {
      await this.connectReady
      this.ws.send(JSON.stringify({
        "sub": `market.overview`,
      }))
      this.hasSubMktOverview = true
    }
  },
  created () {
    console.log('wsBus created!')
    this.init()
  }
})

export default wsBus
