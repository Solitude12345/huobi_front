<template>
  <div id="modify-password">
    <div class="cont-box">
      <div class="cont-title">绑定手机</div>
      <div>
        <div class="mh-auto w40 pv-50">
          <el-form :model="formData">
            <el-form-item
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
            <el-form-item label="短信验证码">
              <div>
                <br>
                <el-input
                  v-model="formData.verifyCode"
                  placeholder="30分钟内输入有效"
                  class="w65"></el-input>
                <el-button
                  type="text"
                  class="ml-20"
                  v-if="!(readingTime>0)"
                  :loading="loading.sendingVerify"
                  @click="sendVerification">发送验证码
                </el-button>
                <span v-else style="margin-left: 20px;">{{`${readingTime}s后重新获取`}}</span>
              </div>
            </el-form-item>
            <el-form-item class="mt-25 pt-25">
              <el-button type="primary w100 font-16"
                         :loading="loading.submit"
                         :disabled="!formData.areaCode || !formData.mobile || !formData.verifyCode"
                         @click="submit">绑定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      readingTime: 0,
      ticker: null,
      loading: {
        sendingVerify: false,
        submit: false
      }
    }
  },
  watch: {
  },
  methods: {
    async sendVerification () {
      let {areaCode, mobile} = this.formData
      if (!areaCode || !mobile) return this.$showErrMsg('请选择地区并输入手机号')
      else if (!/^\d{8,16}$/.test(mobile)) return this.$showErrMsg('手机号有误')
      this.loading.sendingVerify = true
      let res = await this.$fetch('/v1/sendsms/bindMobile', {areaCode, mobile})
        .finally(() => {
          this.loading.sendingVerify = false
        })
      if (res._statusOk) {
        this.$showErrMsg('验证码已发送，请注意查收')
        // 读秒2分钟重新获取验证码
        this.readingTime = 120
        this.ticker = setInterval(() => {
          if (--this.readingTime <= 0) {
            clearInterval(this.ticker)
          }
        }, 1000)
      }
    },
    async submit () {
      this.loading.submit = true
      let {
        areaCode,
        mobile,
        verifyCode: smsCode
      } = this.formData
      let res = await this.$fetch('/v1/user/bindPhone', {
        areaCode,
        mobile,
        smsCode
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
