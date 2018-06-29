<template>
  <div>
    <div class="cont-box">
      <div class="cont-title">{{hasTradePassword ? '重置' : '设置'}}资金密码</div>
      <div class="mh-auto w40 pv-50">
        <el-form
          :rules="rules"
          :validate-on-rule-change="false"
          :model="formData"
          ref="form">
          <el-form-item label="创建资金密码" prop="tradePassword">
            <el-input
              type="password"
              v-model="formData.tradePassword"></el-input>
          </el-form-item>
          <el-form-item label="确认资金密码" prop="checkPassword">
            <el-input
              type="password"
              v-model="formData.checkPassword"></el-input>
          </el-form-item>
          <el-form-item label="短信验证码" prop="verifyCode">
            <div>
              <br>
              <el-input
                v-model="formData.verifyCode"
                placeholder="30分钟内输入有效"
                class="w65"></el-input>
              <send-verify-code-comp
                ref="verify"
                type="setTradePassword"
                class="ml-20"
                @click="sendVerification"
                :disabled="false"/>
            </div>
          </el-form-item>
          <el-form-item class="mt-25 pt-25">
            <el-button
              type="primary w100 font-16"
              :loading="loading.submit"
              :disabled="disableSubmit"
              @click="submit">提交
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {
  verifyCodeValidator,
  tradePasswordValidator,
  notEmpty,
  checkPasswordValidator,
} from "../../assets/js/validators";

export default {
  name: "SetTradePassword",
  data () {
    return {
      formData: {
        verifyCode: '',
        tradePassword: '',
        checkPassword: ''
      },
      loading: {
        submit: false
      }
    }
  },
  computed: {
    disableSubmit () {
      let {
        verifyCode,
        tradePassword,
        checkPassword
      } = this.formData
      return !verifyCodeValidator().pattern.test(verifyCode) ||
        !tradePasswordValidator().pattern.test(tradePassword) ||
        tradePassword !== checkPassword
    },
    rules () {
      return {
        verifyCode: [
          notEmpty('验证码'),
          verifyCodeValidator()
        ],
        tradePassword: [
          notEmpty('创建资金密码'),
          tradePasswordValidator()
        ],
        checkPassword: [
          checkPasswordValidator(this.formData.tradePassword)
        ]
      }
    },
    ...mapState('user', [
      'hasTradePassword'
    ])
  },
  watch: {
    'formData.tradePassword' () {
      this.formData.checkPassword = ''
    }
  },
  methods: {
    sendVerification () {
      this.$refs.verify.send()
    },
    async submit () {
      this.loading.submit = true
      let res = await this.$fetch('/v1/user/tradePassword', {
        tradePassword: this.formData.tradePassword,
        smsCode: this.formData.verifyCode
      })
        .finally(() => {
          this.loading.submit = false
        })
      if (res._statusOk) {
        this.$showErrMsg('成功设置资金密码')
        this.$store.dispatch('user/getUserInfo')
        this.$router.go(-1)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(_this => {
      if (!_this.$store.state.user.mobile) {
        _this.$alert('设置资金密码必须先绑定手机，请先进行手机绑定操作', '提示')
          .finally(() => {
            _this.$router.replace({name: 'BindMobile'})
          })
      }
    })
  }
}
</script>

<style scoped>

</style>
