<template>
  <div class="entry-page">
    <div class="mh-10p">
      <div class="clear-fix">
        <div class="fl w45">
          <h1 class="fw-nm">登录</h1>
          <div class="mv-30">
            <el-form>
              <el-form-item label="账号">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input></el-input>
              </el-form-item>
              <el-form-item class="mt-40">
                <el-button type="primary" class="w35 mr-20">登录</el-button>
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
export default {
  name: "login",
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created () {
  }
}
</script>

<style scoped>
.tip-text{
  margin-top: 100px;
}
</style>
