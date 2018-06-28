import Vue from 'vue'
import Router from 'vue-router'
import Home from '@p/Home'
import Register from '@p/Register'
import Login from '@p/Login'
import Pairs from '@p/Pairs'
import Trade from '@p/Trade'

import Finance from '@p/Finance/Index'
import CtcWallet from '@p/Finance/CtcWallet'
import OtcWallet from '@p/Finance/OtcWallet'

import UserCenter from '@p/UserCenter/Index'
import UserInfo from '@p/UserCenter/UserInfo'
import UserAuth from '@p/UserCenter/UserAuth'
import ModifyPassword from '@p/UserCenter/ModifyPassword'
import BindMobile from '@p/UserCenter/BindMobile'
import BindEmail from '@p/UserCenter/BindEmail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Pairs',
      name: 'Pairs',
      component: Pairs
    },
    {
      path: '/Trade',
      name: 'Trade',
      component: Trade
    },
    {
      path: '/Finance',
      component: Finance,
      children: [
        {
          path: '',
          redirect: 'CtcWallet'
        },
        {
          path: 'CtcWallet',
          name: 'CtcWallet',
          component: CtcWallet
        },
        {
          path: 'OtcWallet',
          name: 'OtcWallet',
          component: OtcWallet
        },
      ]
    },
    {
      path: '/UserCenter',
      component: UserCenter,
      children: [
        {
          path: 'UserInfo',
          name: 'UserInfo',
          component: UserInfo
        },
        {
          path: 'UserAuth',
          name: 'UserAuth',
          component: UserAuth
        },
        {
          path: 'ModifyPassword',
          name: 'ModifyPassword',
          component: ModifyPassword
        },
        {
          path: 'BindMobile',
          name: 'BindMobile',
          component: BindMobile
        },
        {
          path: 'BindEmail',
          name: 'BindEmail',
          component: BindEmail
        },

      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
