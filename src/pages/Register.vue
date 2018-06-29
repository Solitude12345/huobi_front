<template>
  <div id="page-register" class="entry-page">
    <div class="mh-10p">
      <div class="clear-fix">
        <div class="fl w45">
          <h1 class="fw-nm">欢迎注册</h1>
          <div class="mv-30">
            <span class="link"
                  @click="registerType='mobile'"
                  :class="{'is-active': registerType==='mobile'}">手机注册</span>
            <span class="link"
                  @click="registerType='email'"
                  :class="{'is-active': registerType==='email'}">邮箱注册</span>
          </div>
          <div>
            <el-form :rules="rules"
                     ref="form"
                     :validate-on-rule-change="false"
                     :model="formData">
              <el-form-item label="国籍"
                            prop="countryId">
                <div>
                  <el-select v-model="formData.countryId"
                             class="w100">
                    <el-option v-for="areaCode in areaCodes"
                               :key="areaCode.country_id"
                               :label="areaCode.name_en"
                               :value="areaCode.country_id">
                      <span class="fl">{{areaCode.name_en}}</span>
                      <span class="fr">{{areaCode.name_cn}}</span>
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item key="mobile" v-if="registerType==='mobile'"
                            prop="phoneNumber"
                            label="手机号码">
                <el-input v-model.trim="formData.phoneNumber">
                  <template slot="prepend">
                    <el-select v-model="formData.areaCode" placeholder="地区号">
                      <el-option v-for="areaCode in areaCodes"
                                 :key="areaCode.country_id"
                                 :value="areaCode.area_code">
                        <span class="fl">{{areaCode.name_en}}</span>
                        <span class="fr">{{areaCode.area_code}}</span>
                      </el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item key="email" v-if="registerType==='email'"
                            prop="email"
                            label="邮箱">
                <el-input v-model.trim="formData.email"></el-input>
              </el-form-item>
              <el-form-item :label="registerType === 'mobile'?'短信验证码':'邮件验证码'"
                            prop="verifyCode">
                <div>
                  <br>
                  <el-input
                    v-model="formData.verifyCode"
                    placeholder="30分钟内输入有效"
                    class="w65"></el-input>
                  <send-verify-code-comp type="register"
                                         class="ml-20"
                                         ref="verify"
                                         @click="sendVerify"
                                         :mobile="formData.phoneNumber"
                                         :email="formData.email"
                                         :disabled="disableSendVerifyCode"
                                         :areaCode="formData.areaCode" />
                </div>
              </el-form-item>
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="formData.password" type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPassword">
                <el-input v-model="formData.checkPassword" type="password"></el-input>
              </el-form-item>
              <el-form-item label="邀请码（选填）" prop="inviteCode">
                <el-input v-model.trim="formData.inviteCode"></el-input>
              </el-form-item>
              <el-form-item prop="agree">
                <el-checkbox v-model="formData.agree">
                  <span class="color-normal">我已阅读并同意 </span>
                </el-checkbox>
                <el-button type="text">《用户协议》</el-button>
              </el-form-item>
              <el-form-item class="mt-25">
                <el-button type="primary"
                           @click="submit"
                           :loading="loading.submit"
                           :disabled="!formData.agree"
                           class="w35">注册</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="fr w45">
          <p class="color-weak tip-text">
            国籍信息注册后不可修改，请务必如实选择。<br>
            <br>
            验证邮件可能会被误判为垃圾邮件，请注意查收。<br>
            <br>
            请妥善保存您的Huobi账号及登录密码。<br>
            <br>
            请勿和其他网站使用相同的登录密码。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  notEmpty,
  phoneNumberValidator,
  emailValidator,
  checkPasswordValidator,
  verifyCodeValidator,
  loginPasswordValidator,
} from "../assets/js/validators";

export default {
  name: "register",
  data () {
    return {
      registerType: 'mobile',
      formData: {
        countryId: '',
        areaCode: '',
        phoneNumber: '',
        email: '',
        verifyCode: '',
        password: '',
        checkPassword: '',
        inviteCode: '',
        agree: false
      },
      areaCodes: [],
      loading: {
        submit: false,
      }
    }
  },
  computed: {
    rules () {
      return {
        countryId: [
          notEmpty('国籍')
        ],
        areaCode: [
          notEmpty('区号'),
        ],
        email: this.registerType === 'email' && [
          notEmpty('邮箱'),
          emailValidator()
        ],
        phoneNumber: this.registerType === 'mobile' && [
          notEmpty('手机号'),
          phoneNumberValidator(),
        ],
        verifyCode: [
          notEmpty('验证码'),
          verifyCodeValidator()
        ],
        password: [
          notEmpty('账户密码'),
          loginPasswordValidator(),
        ],
        checkPassword: [
          checkPasswordValidator(this.formData.password)
        ],
        inviteCode: [],
        agree: []
      }
    },
    disableSendVerifyCode () {
      switch (this.registerType) {
        case 'mobile':
          return !this.formData.areaCode || !phoneNumberValidator().pattern.test(this.formData.phoneNumber)
        case 'email':
          return !emailValidator().pattern.test(this.formData.email)
      }
    }
  },
  watch: {
    'formData.password' () {
      this.formData.checkPassword = ''
    },
    registerType () {
      this.$refs.form.resetFields()
      this.formData.areaCode = ''
      this.$refs.verify.init()
    },
    'formData.countryId' (cId) {
      if (cId) this.formData.areaCode = this.areaCodes.find(item => item.country_id === cId).area_code
    }
  },
  methods: {
    async submit () {
      let valid = await this.$refs.form.validate()
      if (!valid) return
      this.loading.submit = true
      let res = await this.$tipPost('/v1/user/register', this.formData)
        .finally(() => {
          this.loading.submit = false
        })
      if (res._statusOk) {
        this.$alert('注册成功，将为您跳转到登录页面。')
          .finally(() => {
            this.$router.push({name: 'Login'})
          })
      }
    },
    sendVerify () {
      this.$refs.verify.send()
    },
  },
  async created () {
    let res = await this.$get('/static/areaCode.json')
    this.areaCodes = res.data
  }
}
</script>

<style scoped>
  .link{
    border-bottom-width: 2px;
    margin-right: 30px;
  }
  .tip-text{
    margin-top: 160px;
  }
</style>
