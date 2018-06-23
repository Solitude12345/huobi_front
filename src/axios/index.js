import Vue from 'vue'
import axios from 'axios'
import {Message, Notification} from 'element-ui'
import store from '@/store'
import router from '@/router'

let axiosInstance = axios.create({})

axiosInstance.interceptors.response.use(
  res => res && typeof res.data === 'object'
    ? Object.assign(res.data, {
      _statusOk: res.data.status === 10000
    })
    : res,
  err => {
    console.log(err)
    // Message.error('连接出错')
    return Promise.reject(err)
  }
)

let {get: $get, post: $post} = axiosInstance

let $tipPost = axiosInstance.$tipPost = async function (...args) {
  let res = await $post(...args)
  !res._statusOk && Message.error('' + res.msg)
  return res
}

let updateStatus = {
  ready: 'ready',
  pending: 'pending'
}
let isErrorTipping = false
let reqTokenUpdate = Promise.resolve(1) // 刷新token的请求
let isTokenUpdating = updateStatus.ready // token请求的当前状态

let inValidLogin = function () {
  if (!isErrorTipping) {
    Notification.error({
      title: '登录过期',
      message: '您的登录状态已过期，请重新登录。',
      showClose: false,
      offset: 88,
      onClose () {
        isErrorTipping = false
      }
    })
    isErrorTipping = true
  }
  !store.state.loginBack && store.commit('updateLoginBack', router.currentRoute.name)
  store.dispatch('aLogout') // 强制注销用户信息
}

let $fetch = axiosInstance.$fetch = async function $fetch (...args) {
  let res = await $post(...args)
  if (res._statusOk) return res
  if (res.status !== 90005) {
    // 非 无登录状态 引起的异常
    Message.error('' + res.msg)
    return res
  } else {
    // 需要登录状态但token无效
    let {refresh_token} = store.state

    // 已登录但token失效
    if (refresh_token) {
      // 如果有refresh_token尝试刷新token
      switch (isTokenUpdating) {
        // 并发请求防止多次触发refreshToken
        case updateStatus.ready:
          reqTokenUpdate = $post('/api/refresh_token', {refresh_token})
            .then(
              resRefresh => {
                if (resRefresh && resRefresh._statusOk) {
                  // 刷新token成功 更新本地token，重发请求
                  store.commit('mLogin', resRefresh.data)
                  return $fetch(...args)
                } else {
                  // 刷新失败
                  inValidLogin()
                  return res
                }
              },
              () => {
                inValidLogin()
                return res
              }
            ).finally(() => {
              isTokenUpdating = updateStatus.ready
            }
            )
          isTokenUpdating = updateStatus.pending
          return reqTokenUpdate
        case updateStatus.pending:
          await reqTokenUpdate
          return $fetch(...args)
      }
    } else {
      // 没有refresh_token
      if (!isErrorTipping) {
        Notification.error({
          title: '未登录',
          message: '该页面的访问和操作需要您的登录授权。',
          showClose: false,
          offset: 88,
          onClose () {
            isErrorTipping = false
          }
        })
        isErrorTipping = true
      }
      !store.state.loginBack && store.commit('updateLoginBack', router.currentRoute.name)
      router.push('/Login')
      return res
    }
  }
}

Object.assign(Vue.prototype, {
  $http: axiosInstance,
  $post: $post,
  $get: $get,
  $tipPost: $tipPost,
  $fetch: $fetch
})

export {
  axiosInstance as default,
  $get,
  $post,
  $tipPost,
  $fetch
}
