<template>
  <div class="comp-send-verify">
    <el-button
      @click="$emit('click')"
      type="text"
      v-if="!(readingTime>0)"
      :loading="loading"
      :disabled="disabled">发送验证码
    </el-button>
    <span v-else>{{`${readingTime}s 后重新获取`}}</span>
  </div>
</template>

<script>
export default {
  name: "SendVerifyCodeComp",
  props: [
    'disabled',
    'type',
    'areaCode',
    'mobile',
    'email'
  ],
  data () {
    return {
      readingTime: 0,
      loading: false,
      ticker: null
    }
  },
  computed: {
  },
  watch: {},
  methods: {
    async wrapRequest (req) {
      this.loading = true
      let res = await req
        .finally(() => {
          this.loading = false
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
    send () {
      if (!this.disabled) {
        let req
        switch (this.type) {
          case 'register':
            if (this.mobile) {
              req = this.$tipPost('/v1/sendsms/register', {
                mobile: this.mobile,
                areaCode: this.areaCode
              })
            } else if (this.email) {
              req = this.$tipPost('/v1/sendmail', {
                email: this.email,
                emailType: 'register',
              })
            }
            break
          case 'bindMobile':
            req = this.$fetch('/v1/sendsms/bindMobile', {
              areaCode: this.areaCode,
              mobile: this.mobile
            })
            break
          case 'bindEmail':
            req = this.$fetch('/v1/sendmail', {
              emailType: 'bindEmail',
              email: this.email
            })
            break
          case 'setTradePassword':
            req = this.$fetch('/v1/sendsms/setTradePassword')
            break
          case 'forgetPassword':
            if (this.mobile) {
              req = this.$tipPost('/v1/sendsms/forgetPassword', {
                mobile: this.mobile,
                areaCode: this.areaCode
              })
            } else {
              req = this.$tipPost('/v1/sendmail', {
                email: this.email,
                emailType: 'forgetPassword'
              })
            }
            break
        }
        req && this.wrapRequest(req)
      }
    },
    init () {
      this.readingTime = 0
      this.loading = false
      clearTimeout(this.ticker)
      this.ticker = null
    }
  },
  created () {
  }
}
</script>

<style scoped>
  .comp-send-verify{
    display: inline-block;
  }
  .el-button--text.is-disabled{
    color: #61688a;
  }
</style>
