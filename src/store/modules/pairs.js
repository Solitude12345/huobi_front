import {$get} from '@/axios'

export default {
  namespaced: true,
  state: {
    quotationBaseCoin: localStorage.getItem('quotationBaseCoin') || 'USDT',
    baseCoin: 'USDT',
    targetCoin: 'BTC',
    allPairSymbols: JSON.parse(localStorage.getItem('allPairSymbols')) || {},
    currentMkt: {}
  },
  getters: {
    klineSymbol (state) {
      return (state.targetCoin + state.baseCoin).toLowerCase()
    }
  },
  mutations: {
    updateBaseCoin (state, newBaseCoin) {
      state.baseCoin = newBaseCoin
    },
    updateTargetCoin (state, newTargetCoin) {
      state.targetCoin = newTargetCoin
    },
    updateKlineSymbol (state, {baseCoin, targetCoin}) {
      state.baseCoin = baseCoin
      state.targetCoin = targetCoin
    },
    updateGetAllSymbols (state, allSymbols) {
      state.allPairSymbols = allSymbols
      localStorage.setItem('allPairSymbols', JSON.stringify(allSymbols))
    },
    marketOverview (state, arrData) {
      let allSbls = state.allPairSymbols
      let baseCoins = Object.keys(allSbls)
      arrData.forEach(pair => {
        baseCoins.forEach(bc => {
          let idx = pair.symbol.lastIndexOf(bc.toLowerCase())
          if (idx !== 0 && ~idx) {
            allSbls[bc][pair.symbol.slice(0, idx).toUpperCase()] = pair
          }
        })
      })
    },
    updateQuotationBaseCoin (state, coin) {
      state.quotationBaseCoin = coin
      localStorage.setItem('quotationBaseCoin', coin)
    }
  },
  actions: {
    async getAllSymbols ({commit, dispatch}) {
      let res
      try {
        res = await $get('https://api.huobipro.com/v1/common/symbols')
      } catch (err) {
        return dispatch('getAllSymbols')
      }
      if (res.status === 'ok') {
        let obj = {}
        res.data.forEach(pair => {
          let baseCoinObj = obj[pair['quote-currency'].toUpperCase()] || (obj[pair['quote-currency'].toUpperCase()] = {})
          baseCoinObj[pair['base-currency'].toUpperCase()] = {
            amount: null,
            close: null,
            count: null,
            high: null,
            low: null,
            open: null,
            symbol: null,
            vol: null,
          }
        })
        commit('updateGetAllSymbols', obj)
      }
    }
  }
}
