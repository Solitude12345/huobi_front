<template>
  <div>
    <div class="cont-box">
      <div class="cont-title">{{$store.state.user.mobile && '修改'}}绑定手机</div>
      <div>
        <div class="mh-auto w40 pv-50">
          <el-form :model="formData" :rules="rules">
            <el-form-item
              prop="mobile"
              label="手机号码">
              <el-input v-model.trim="formData.mobile">
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
            <el-form-item
              prop="verifyCode"
              label="短信验证码">
              <div>
                <br>
                <el-input
                  v-model="formData.verifyCode"
                  placeholder="30分钟内输入有效"
                  class="w65"></el-input>
                <send-verify-code-comp
                  ref="verify"
                  type="bindMobile"
                  class="ml-20"
                  @click="sendVerification"
                  :disabled="disableSendVerify"
                  :areaCode="formData.areaCode"
                  :mobile="formData.mobile" />
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
  phoneNumberValidator,
  verifyCodeValidator,
  notEmpty
} from '@a/js/validators'
export default {
  name: "BindMobile",
  data () {
    return {
      areaCodes: [],
      formData: {
        areaCode: '',
        mobile: '',
        verifyCode: ''
      },
      loading: {
        submit: false
      },
      rules: {
        mobile: [
          notEmpty('手机号'),
          phoneNumberValidator()
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
      return !this.formData.areaCode ||
        !phoneNumberValidator().pattern.test(this.formData.mobile)
    },
    disableSubmit () {
      return !this.formData.areaCode ||
        !phoneNumberValidator().pattern.test(this.formData.mobile) ||
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
      let {value: password} = await this.$loginPassword(`您正在${this.$store.state.user.mobile ? '修改绑定' : '绑定'}手机号,`)
      this.loading.submit = true
      let {
        areaCode,
        mobile,
        verifyCode
      } = this.formData
      let res = await this.$fetch('/v1/user/bindPhone', {
        areaCode,
        mobile,
        smsCode: verifyCode,
        password
      })
        .finally(() => {
          this.loading.submit = false
        })
      if (res._statusOk) {
        this.$showErrMsg('成功绑定手机')
        this.$store.dispatch('user/getUserInfo')
        this.$router.go(-1)
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

</style>
