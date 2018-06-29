<template>
  <div>
    <div class="cont-box">
      <div class="cont-title">修改登录密码</div>
      <div>
        <div class="mh-auto w40 pv-50">
          <el-form :model="formData"
                   ref="form"
                   :rules="rules"
                   :validate-on-rule-change="false">
            <el-form-item label="原登录密码" prop="oldPassword">
              <el-input type="password" v-model="formData.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新登录密码" prop="newPassword">
              <el-input type="password" v-model="formData.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPassword">
              <el-input type="password" v-model="formData.checkPassword"></el-input>
            </el-form-item>
            <el-form-item class="mt-25 pt-25">
              <el-button type="primary w100 font-16"
                         :loading="loading.submit"
                         :disabled="disableSubmit"
                         @click="submit">修改</el-button>
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
  loginPasswordValidator,
  checkPasswordValidator,
} from "@a/js/validators";

export default {
  name: "ModifyPassword",
  data () {
    return {
      formData: {
        oldPassword: '',
        newPassword: '',
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
        oldPassword,
        newPassword,
        checkPassword
      } = this.formData
      return !oldPassword ||
        !loginPasswordValidator().pattern.test(newPassword) ||
        checkPassword !== newPassword
    },
    rules () {
      return {
        oldPassword: [
          notEmpty('原密码')
        ],
        newPassword: [
          notEmpty('新密码'),
          loginPasswordValidator()
        ],
        checkPassword: [
          checkPasswordValidator(this.formData.newPassword)
        ],
      }
    }
  },
  watch: {
    'formData.newPassword' () {
      this.formData.checkPassword = ''
    }
  },
  methods: {
    async submit () {
      let valid = await this.$refs.form.validate()
      if (!valid) return
      this.loading.submit = true
      let {oldPassword, newPassword} = this.formData
      let res = await this.$fetch('/v1/user/password', {oldPassword, newPassword})
        .finally(() => {
          this.loading.submit = false
        })
      if (res._statusOk) {
        this.$alert('登录密码已修改，请重新登录')
          .finally(() => {
            this.$store.dispatch('user/logout', false)
            localStorage.setItem('loginBack', 'UserInfo')
            location.href = '/#/Login'
            location.reload()
          })
      }
    }
  },
  created () {
  }
}
</script>

<style scoped>

</style>
