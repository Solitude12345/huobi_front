import Vue from 'vue'
import '@/assets/js/filters'
import store from "@/store";

import {
  loginPasswordValidator,
  tradePasswordValidator,
} from './validators'
const oLoginPasswordValidator = loginPasswordValidator()
const otradePasswordValidator = tradePasswordValidator()

const proto = Vue.prototype

proto.log = console.log

proto.$showErrMsg = msg => store.dispatch('showErrMsg', msg)

proto.$getUserInfo = () => store.dispatch('user/getUserInfo')

proto.$loginPassword = info => proto.$prompt(`${info || ''} 请输入登录密码`, '安全验证', {
  inputType: 'password',
  showCancelButton: false,
  closeOnClickModal: false,
  inputPattern: oLoginPasswordValidator.pattern,
  inputErrorMessage: oLoginPasswordValidator.message
})

proto.$tradePassword = info => proto.$prompt(`${info || ''} 请输入资金密码`, '交易验证', {
  inputType: 'password',
  showCancelButton: false,
  closeOnClickModal: false,
  inputPattern: otradePasswordValidator.pattern,
  inputErrorMessage: otradePasswordValidator.message
})
