<template>
  <div class="finance-table cont-box">
    <table>
      <thead>
      <tr class="color-weak">
        <th class="w20">币种</th>
        <th class="w20">可用</th>
        <th class="w20">冻结</th>
        <th class="w10"></th>
        <th class="w30">操作</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="oCoin in walletData">
        <tr :key="oCoin.coin" :class="{'is-active': oCoin.coin===currentCoin}">
          <td>{{oCoin.coin | upperCase}}</td>
          <td>{{oCoin.free | sliceTo(8)}}</td>
          <td>{{oCoin.freeze | sliceTo(8)}}</td>
          <td></td>
          <td class="operation">
            <a @click="showTrans(oCoin.coin, 'in')">充币</a>
            <a @click="showTrans(oCoin.coin, 'out')">提币</a>
            <a>交易</a>
          </td>
        </tr>
        <tr v-if="currentCoin===oCoin.coin" :key="oCoin.coin+'append'" class="trans-tr">
          <td colspan="5">
            <div class="trans-in-box" v-if="transDirection==='in'">
              <p class="mt-0">充币地址</p>
              <div>
                <span class="coin-addr">1NfeuPpn8W7XdiLPy1EWHFmofa3BtnAoLm</span>
                <a class="mh-20">复制</a><a>二维码</a>
              </div>
              <p>查看<a>充币记录</a>跟踪状态</p>
              <p>
                温馨提示：<br>
                • 请勿向上述地址充值任何非XXX资产，否则资产将不可找回。<br>
                • 您充值至上述地址后，需要整个网络节点的确认，2次网络确认后到账，6次网络确认后可提币。<br>
                • 最小充值金额：0.01 XXX，小于最小金额的充值将不会上账且无法退回。<br>
                • 您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。<br>
                • 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
              <i class="angle"></i>
            </div>
            <div class="trans-out-box" v-if="transDirection==='out'">
              <div class="">
                <el-form>
                  <el-form-item label="提币地址">
                    <el-input></el-input>
                  </el-form-item>
                  <el-form-item label="数量">
                    <el-input></el-input>
                  </el-form-item>
                  <div class="clear-fix">
                    <div class="w50 fl border-box pr-15">
                      <el-form-item label="手续费">
                        <el-input></el-input>
                      </el-form-item>
                    </div>
                    <div class="w50 fl border-box pl-15">
                      <el-form-item label="到账数量">
                        <el-input></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
                <div class="clear-fix pt-15">
                  <div class="fl w60">
                    <p>
                      温馨提示：<br>
                      • 最小提币数量为：200 XXX。<br>
                      • 为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。<br>
                      • 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。
                    </p>
                  </div>
                  <div class="fr w20">
                    <el-button type="primary" class="w100 pv-15 font-16 mt-20">提币</el-button>
                  </div>
                </div>
              </div>
              <i class="angle"></i>
            </div>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "CtcWallet",
  data () {
    return {
      currentCoin: 'usdt',
      transDirection: '', // in | out
      walletData: []
    }
  },
  computed: {
    ...mapState('user', [
      'balance'
    ])
  },
  watch: {
  },
  methods: {
    showTrans (coin, direction) {
      this.transDirection = direction
      this.currentCoin = coin
    }
  },
  async created () {
    let res = await this.$fetch('/v1/account/coin')
    if (res._statusOk) this.walletData = res.data
  }
}
</script>
