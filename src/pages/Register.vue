<template>
  <div id="page-register" class="entry-page">
    <div class="mh-10p">
      <div class="clear-fix">
        <div class="fl w45">
          <h1 class="fw-nm">欢迎注册</h1>
          <div class="mv-30">
            <span class="link"
                  @click="registerType='phone'"
                  :class="{'is-active': registerType==='phone'}">手机注册</span>
            <span class="link"
                  @click="registerType='email'"
                  :class="{'is-active': registerType==='email'}">邮箱注册</span>
          </div>
          <div>
            <el-form>
              <el-form-item label="国籍">
                <el-input></el-input>
              </el-form-item>
              <el-form-item v-if="registerType==='phone'"
                            label="手机号码">
                <el-input>
                  <template slot="prepend">
                    <el-select v-model="formData.areaCode">
                      <el-option v-for="areaCode in areaCodes"
                                 :key="areaCode.county_id"
                                 :value="areaCode.area_code">
                        <span class="fl">{{areaCode.name_en}}</span>
                        <span class="fr">{{areaCode.area_code}}</span>
                      </el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="registerType==='email'"
                            label="邮箱">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="登录密码">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="邀请码（选填）">
                <el-input></el-input>
              </el-form-item>
              <el-form-item>
                <el-checkbox>
                  <span class="color-normal">我已阅读并同意 </span>
                </el-checkbox>
                <el-button type="text">《用户协议》</el-button>
              </el-form-item>
              <el-form-item class="mt-25">
                <el-button type="primary" class="w35">注册</el-button>
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
export default {
  name: "register",
  data () {
    return {
      registerType: 'phone',
      formData: {
        areaCode: '0086'
      },
      areaCodes: []
    }
  },
  computed: {},
  watch: {},
  methods: {},
  async created () {
    let res = await this.$get('/static/areaCode.json')
    this.areaCodes = res.data
    /*
    * resCode ==> {
    * "area_code":"00355",
    * "country_id":3,
    * "name_cn":"阿尔巴尼亚",
    * "name_en":"Albania"
    * }
    * */
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
