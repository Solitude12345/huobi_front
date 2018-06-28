import {$get, $fetch} from '@/axios'

export default {
  namespaced: true,
  state: {
    uid: null,
    authorized: false,
    refreshToken: localStorage.getItem('refreshToken'),
    nickname: localStorage.getItem('nickname'),
    balance: {},
    email: null,
    mobile: null,
  },
  getters: {
    authorized (state) {
      return !!state.refreshToken && !!state.nickname
    }
  },
  mutations: {
    updateGetBalance (state, list) {
      state.balance = list
    },
    updateRefreshToken (state, refreshToken) {
      state.refreshToken = refreshToken
      refreshToken
        ? localStorage.setItem('refreshToken', refreshToken)
        : localStorage.removeItem('refreshToken')
    },
    updateNickname (state, nickname) {
      state.nickname = nickname
      nickname
        ? localStorage.setItem('nickname', nickname)
        : localStorage.removeItem('nickname')
    },
    updateUserInfo (state, data) {
      Object.assign(state, data)
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
    },
    async logout ({commit}, toHome = true) {
      let res = await $fetch('/v1/user/logout')
      if (res._statusOk) {
        commit('updateRefreshToken', null)
        commit('updateNickname', null)
        if (toHome) location.href = '/'
      }
    },
    async getUserInfo ({commit}) {
      let res = await $fetch('/v1/user/userinfo')
      res._statusOk && commit('updateUserInfo', res.data)
    }
  }
}
