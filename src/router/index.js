import Vue from 'vue'
import Router from 'vue-router'
import Home from '@p/Home'
import Register from '@p/Register'
import Login from '@p/Login'
import Pairs from '@p/Pairs'
import Trade from '@p/Trade'
import Finance from '@p/Finance'
import UserCenter from '@p/UserCenter/Index'
import UserInfo from '@p/UserCenter/UserInfo'
import UserAuth from '@p/UserCenter/UserAuth'

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
      name: 'Finance',
      component: Finance
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

      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
