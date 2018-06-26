<template>
  <div class="entry-page">
    <div class="mh-10p">
      <div class="clear-fix">
        <div class="fl w45">
          <h1 class="fw-nm">登录</h1>
          <div class="mv-30">
            <el-form>
              <el-form-item label="账号">
                <el-input v-model.trim="formData.username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="formData.password"></el-input>
              </el-form-item>
              <el-form-item class="mt-40">
                <el-button type="primary"
                           @click="login"
                           :disabled="!formData.username || !formData.password"
                           :loading="loading.login"
                           class="w35 mr-20">登录</el-button>
                <el-button type="text">忘记密码？</el-button>
              </el-form-item>

            </el-form>
          </div>
        </div>
        <div class="fr w45">
          <div class="tip-text">
            <p class="color-weak">
              还不是Huobi的用户？<br>
              <br>
              立即注册，在全球领先的数字资产交易平台开始交易。
            </p>
            <router-link :to="{name: 'Register'}">
              <el-button type="text">免费注册</el-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  name: "login",
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      loading: {
        login: false
      }
    }
  },
  computed: {
  },
  watch: {},
  methods: {
    async login () {
      this.loading.login = true
      let res = await this.$post('/v1/user/login', this.formData)
        .finally(() => {
          this.loading.login = false
        })
      if (res._statusOk) {
        let {nickname, refresh_token} = res.data
        this.updateRefreshToken(refresh_token)
        this.updateNickname(nickname)
        // this.$router.push({name: 'Pairs'})
        this.$router.go(-1)
      } else if (res.status === 10002) {
        // 密码错误
        this.showErrMsg(`密码有误，您还有 ${res.data.surplus_count} 次重试机会`)
      } else if (res.status === 10003) {
        // 已冻结
        let {limitTime} = res.data
        let hours = Math.floor(limitTime / 60 / 60)
        let minutes = Math.ceil((limitTime % (60 * 60)) / 60)
        this.showErrMsg(`账号已被冻结，请 ${hours ? `${hours} 小时 ` : ''}${minutes} 分钟后再试`)
      } else {
        this.showErrMsg(res.msg)
      }
    },
    ...mapMutations('user', [
      'updateRefreshToken',
      'updateNickname'
    ])
  }
}
</script>

<style scoped>
.tip-text{
  margin-top: 100px;
}
</style>
