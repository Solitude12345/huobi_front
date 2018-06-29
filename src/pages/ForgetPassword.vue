<template>
  <div class="page-container">
    <div class="cont-box page-title">重置登录密码</div>
    <div class="cont-box">
      <div class="cont-title">
        <span
          :class="{'is-active': verifyType === 'mobile'}"
          @click="verifyType = 'mobile'"
          class="link lh-1">手机验证</span>
        <span
          :class="{'is-active': verifyType === 'email'}"
          @click="verifyType = 'email'"
          class="link lh-1">邮箱验证</span>
      </div>
      <div class="mh-auto w40 pv-50">
        <el-form
          ref="form"
          :validate-on-rule-change="false"
          :model="formData"
          :rules="rules">
          <el-form-item
            key="mobile" v-if="verifyType==='mobile'"
            prop="phoneNumber"
            label="手机号码">
            <el-input v-model.trim="formData.phoneNumber">
              <template slot="prepend">
                <el-select v-model="formData.areaCode" placeholder="地区号">
                  <el-option
                    v-for="areaCode in areaCodes"
                    :key="areaCode.country_id"
                    :value="areaCode.area_code">
                    <span class="fl">{{areaCode.name_en}}</span>
                    <span class="fr">{{areaCode.area_code}}</span>
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            key="email"
            v-if="verifyType==='email'"
            prop="email"
            label="邮箱">
            <el-input v-model.trim="formData.email"></el-input>
          </el-form-item>
          <el-form-item
            :label="verifyType === 'mobile'?'短信验证码':'邮件验证码'"
            prop="verifyCode">
            <div>
              <br>
              <el-input
                v-model="formData.verifyCode"
                placeholder="30分钟内输入有效"
                class="w65"></el-input>
              <send-verify-code-comp
                type="forgetPassword"
                class="ml-20"
                ref="verify"
                @click="sendVerify"
                :mobile="formData.phoneNumber"
                :email="formData.email"
                :disabled="disableSendVerifyCode"
                :areaCode="formData.areaCode"/>
            </div>
          </el-form-item>
          <el-form-item
            label="新的登录密码"
            prop="password">
            <el-input
              type="password"
              v-model="formData.password"></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="checkPassword">
            <el-input
              type="password"
              v-model="formData.checkPassword"></el-input>
          </el-form-item>
          <el-form-item class="mt-25 pt-25">
            <el-button
              type="primary w100 font-16"
              :loading="loading.submit"
              :disabled="disableSubmit"
              @click="submit">重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  notEmpty,
  emailValidator,
  phoneNumberValidator,
  checkPasswordValidator,
  verifyCodeValidator,
  loginPasswordValidator
} from '../assets/js/validators'
export default {
  name: "ForgetPassword",
  data () {
    return {
      areaCodes: [],
      verifyType: 'mobile',
      formData: {
        verifyCode: '',
        areaCode: '',
        email: '',
        phoneNumber: '',
        password: '',
        checkPassword: ''
      },
      loading: {
        submit: false
      }
    }
  },
  computed: {
    disableSendVerifyCode () {
      switch (this.verifyType) {
        case 'mobile':
          let {
            areaCode,
            phoneNumber
          } = this.formData
          return !areaCode ||
            !phoneNumberValidator().pattern.test(phoneNumber)
        case 'email':
          let {
            email
          } = this.formData
          return !emailValidator().pattern.test(email)
      }
    },
    disableSubmit () {
      let {
        verifyCode,
        password,
        checkPassword
      } = this.formData
      if (!verifyCodeValidator().pattern.test(verifyCode) ||
        !loginPasswordValidator().pattern.test(password) ||
        checkPassword !== password) return true
      switch (this.verifyType) {
        case 'mobile':
          let {
            areaCode,
            phoneNumber,
          } = this.formData
          return !areaCode ||
            !phoneNumberValidator().pattern.test(phoneNumber)
        case 'email':
          return !emailValidator().pattern.test(this.formData.email)
      }
    },
    rules () {
      return {
        verifyCode: [
          notEmpty('验证码'),
          verifyCodeValidator(),
        ],
        areaCode: [],
        email: this.verifyType === 'email' && [
          notEmpty('邮箱'),
          emailValidator()
        ],
        phoneNumber: this.verifyType === 'mobile' && [
          notEmpty('手机号'),
          phoneNumberValidator()
        ],
        password: [
          notEmpty('资金密码'),
          loginPasswordValidator()
        ],
        checkPassword: [
          checkPasswordValidator(this.formData.password)
        ]
      }
    }
  },
  watch: {
    verifyType () {
      this.$refs.form.resetFields()
      this.formData.areaCode = ''
      this.$refs.verify.init()
    },
    'formData.password' () {
      this.formData.checkPassword = ''
    }
  },
  methods: {
    sendVerify () {
      this.$refs.verify.send()
    },
    async submit () {
      this.loading.submit = true
      let {
        verifyCode,
        areaCode,
        email,
        phoneNumber,
        password
      } = this.formData
      let res = await this.$fetch('/v1/user/forgetPassword', {
        username: email || phoneNumber,
        password,
        verifyCode,
        areaCode
      })
        .finally(() => {
          this.loading.submit = false
        })
      if (res._statusOk) {
        this.$alert('重置密码成功, 将为您跳转登录')
          .finally(() => {
            this.$router.push({name: 'Login'})
          })
      }
    }
  },
  async created () {
    let res = await this.$get('/static/areaCode.json')
    this.areaCodes = res.data
  }
}
</script>

<style scoped>
  .link {
    border-bottom-width: 2px;
  }
</style>
