<template>
  <div>
    <div class="cont-box">
      <div class="cont-title">{{$store.state.user.email && '修改'}}绑定邮箱</div>
      <div>
        <div class="mh-auto w40 pv-50">
          <el-form :model="formData" :rules="rules">
            <el-form-item
              prop="email"
              label="邮箱">
              <el-input v-model.trim="formData.email">
              </el-input>
            </el-form-item>
            <el-form-item
              prop="verifyCode"
              label="邮件验证码">
              <div>
                <br>
                <el-input
                  v-model="formData.verifyCode"
                  placeholder="30分钟内输入有效"
                  class="w65"></el-input>
                <send-verify-code-comp
                  ref="verify"
                  :email="formData.email"
                  type="bindEmail"
                  class="ml-20"
                  @click="sendVerification"
                  :disabled="disableSendVerify"/>
              </div>
            </el-form-item>
            <el-form-item class="mt-25 pt-25">
              <el-button type="primary w100 font-16"
                         :loading="loading.submit"
                         :disabled="disableSubmit"
                         @click="submit">绑定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  notEmpty,
  emailValidator,
  verifyCodeValidator
} from '@a/js/validators'
export default {
  name: "BindEmail",
  data () {
    return {
      formData: {
        email: '',
        verifyCode: ''
      },
      loading: {
        submit: false
      },
      rules: {
        email: [
          notEmpty('邮箱'),
          emailValidator()
        ],
        verifyCode: [
          notEmpty('验证码'),
          verifyCodeValidator()
        ]
      }
    }
  },
  computed: {
    disableSendVerify () {
      return !emailValidator().pattern.test(this.formData.email)
    },
    disableSubmit () {
      return !emailValidator().pattern.test(this.formData.email) ||
        !verifyCodeValidator().pattern.test(this.formData.verifyCode)
    }
  },
  watch: {
  },
  methods: {
    sendVerification () {
      this.$refs.verify.send()
    },
    async submit () {
      let {value: password} = await this.$loginPassword(`您正在${this.$store.state.user.email ? '修改绑定' : '绑定'}邮箱,`)
      this.loading.submit = true
      let {
        email,
        verifyCode
      } = this.formData
      let res = await this.$fetch('/v1/user/bindEmail', {
        email,
        emailCode: verifyCode,
        password
      })
        .finally(() => {
          this.loading.submit = false
        })
      if (res._statusOk) {
        this.$showErrMsg('成功绑定邮箱')
        this.$store.dispatch('user/getUserInfo')
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped>

</style>
