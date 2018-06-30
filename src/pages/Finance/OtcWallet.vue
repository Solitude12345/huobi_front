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
      <template v-for="oCoin in legalBalance.legal">
        <tr :key="oCoin.coin"
            :class="{'is-active': oCoin.coin===currentCoin}">
          <td>{{oCoin.coin | upperCase}}</td>
          <td>{{oCoin.free | sliceTo(8)}}</td>
          <td>{{oCoin.freeze | sliceTo(8)}}</td>
          <td></td>
          <td class="operation">
            <a @click="showTrans(oCoin.coin, 'distribution')">
              <img src="/static/img/icon/arrow-swap.png" height="20" alt="">
              资金划转
            </a>
            <a>交易</a>
          </td>
        </tr>
        <tr v-if="currentCoin===oCoin.coin" :key="oCoin.coin+'append'" class="trans-tr">
          <td colspan="5">
            <div class="trans-distribution-box" v-if="transDirection==='distribution'">
              <div class="pv-20">
                <div class="ml-10p relative w45" style="height: 46px">
                    <span class="wallet-tag tag-ctc"
                          :style="{left:isTransToOtc?'0px':'250px'}">
                        币币账户
                    </span>
                  <img src="/static/img/icon/swap.png"
                       height="25"
                       width="25"
                       @click="isTransToOtc = !isTransToOtc"
                       class="img-swap center-absolute">
                  <span class="wallet-tag tag-otc"
                        :style="{left:!isTransToOtc?'0px':'250px'}">
                    法币账户
                    </span>
                </div>
                <div class="clear-fix distribution-inputer">
                  <div class="fl w10">划转数量</div>
                  <div class="fr w90">
                    <el-form :model="formData" :rules="rules">
                      <el-form-item prop="amount">
                        <el-input class="w50" v-model="formData.amount"></el-input>
                      </el-form-item>
                    </el-form>
                    <div>
                      可转数量：<span class="color-normal">{{transableNum | sliceTo(8)}}</span>
                      <a
                        class="ml-15"
                        @click="formData.amount = transableNum">全部划转</a>
                    </div>
                  </div>
                </div>
                <div class="ml-10p">
                  <el-button type="primary"
                             @click="submit"
                             :disabled="disableSubmit"
                             :loading="loading.submit"
                             class="font-16 w20">划转
                  </el-button>
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
import {mapState, mapActions} from 'vuex'

export default {
  name: "OtcWallet",
  data () {
    return {
      currentCoin: '',
      transDirection: '',
      isTransToOtc: true,
      formData: {
        amount: '',
      },
      loading: {
        submit: false
      }
    }
  },
  computed: {
    disableSubmit () {
      return !(this.formData.amount > 0)
    },
    rules () {
      return {
        amount: [
          {
            validator: (rule, value, cb) => {
              if (!value) return true
              else if (!(Number(value) > 0)) cb('请输入合法数值')
              else if (+value > this.transableNum) cb('超出可转数量')
            }
          }
        ]
      }
    },
    transFee () {
      return 0
    },
    transableNum () {
      let transFrom = this.isTransToOtc
        ? 'coin'
        : 'legal'
      return this.legalBalance[transFrom].find(oCoin => oCoin.coin === this.currentCoin).free
    },
    ...mapState('user', [
      'legalBalance'
    ])
  },
  watch: {
    isTransToOtc () {
      this.formData.amount = ''
    }
  },
  methods: {
    showTrans (coin, direction) {
      this.transDirection = direction
      this.currentCoin = coin
      this.isTransToOtc = true
      this.formData.amount = ''
    },
    async submit () {
      this.loading.submit = true
      let res = await this.$fetch(`/v1/account/transfer/${this.currentCoin}`, {
        amount: this.formData.amount,
        direction: this.isTransToOtc ? 'c_u' : 'u_c'
      })
        .finally(() => {
          this.loading.submit = false
        })
      if (res._statusOk) {
        this.formData.amount = ''
        this.getLegalBalance()
      }
    },
    ...mapActions('user', [
      'getLegalBalance'
    ])
  },
  async created () {
    this.getLegalBalance()
  }
}
</script>

<style scoped>
  .wallet-tag {
    display: inline-block;
    line-height: 46px;
    width: 150px;
    text-align: center;
    background-color: #262a42;
    color: #c7cce6;
    font-size: 16px;
    border-radius: 5px;
    transition: .5s;
    position: absolute;
  }

  .img-swap {
    cursor: pointer;
    box-shadow: 0 0 15px #888;
    border-radius: 50%;
    z-index: 1;
  }

  .ml-10p {
    margin-left: 10%;
  }
  .distribution-inputer {
    line-height: 48px;
    margin: 30px 0 15px;
    font-size: 14px;
  }
</style>
