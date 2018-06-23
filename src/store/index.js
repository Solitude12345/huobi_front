import Vue from 'vue'
import Vuex from 'vuex'

// import modules start
import pairs from './modules/pairs'
import {$get} from "../axios";
// import models end

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    pairs
  },
  state: {
    balance: {}
  },
  mutations: {
    updateGetBalance (state, list) {
      state.balance = list
    }
  },
  actions: {
    async getBalance ({commit}) {
      let res = await $get('/static/balance.json')
      console.log(res)
      let result = {}
      res.data.list.forEach(({currency, type, balance}) => {
        result[currency]
          ? result[currency][type] === undefined && (result[currency][type] = balance)
          : result[currency] = {[type]: balance}
      })
      console.log(result)
      res.status === 'ok' && commit('updateGetBalance', result)
    }
  }
})

export default store
