import Vue from 'vue'
import Vuex from 'vuex'

// import modules start
import pairs from './modules/pairs'
import user from './modules/user'
// import models end

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    pairs
  },
  state: {
    errMsg: '',
    errMsgTimeout: null
  },
  mutations: {
    updateErrMsg (state, msg) {
      state.errMsg = msg
    },
    updateErrMsgTimeout (state, timeoutId, isFocus) {
      !isFocus && clearTimeout(state.errMsgTimeout)
      state.errMsgTimeout = timeoutId
    }
  },
  actions: {
    showErrMsg ({commit}, msg) {
      commit('updateErrMsg', msg)
      let timeoutId = setTimeout(() => {
        commit('updateErrMsg', '')
      }, 4000)
      commit('updateErrMsgTimeout', timeoutId)
    }
  }
})

export default store
