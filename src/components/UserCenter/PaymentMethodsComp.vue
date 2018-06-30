<template>
  <div class="cont-box">
    <div class="cont-title">
      收付款方式
    </div>
    <div>
      <div class="item">
        <div class="item-label">
          <img src="/static/img/icon/bankcard.png" class="mr-5" alt="">
          银行卡
        </div>
        <div class="item-info">asdfasdf</div>
        <div class="item-right">
          <el-switch :value="true" class="mr-10"></el-switch>
          <a>修改</a>
          <a>删除</a>
        </div>
      </div>
      <div class="item">
        <div class="item-label">
          <img src="/static/img/icon/alipay.png" class="mr-5" alt="">
          支付宝
        </div>
        <div class="item-info">asdfasdf</div>
        <div class="item-right">
          <el-switch :value="true" class="mr-10"></el-switch>
          <a>修改</a>
          <a>删除</a>
        </div>
      </div>
      <div class="item">
        <div class="item-label">
          <img src="/static/img/icon/wechat.png" class="mr-5" alt="">
          微信
        </div>
        <div class="item-info">asdfasdf</div>
        <div class="item-right">
          <el-switch :value="true" class="mr-10"></el-switch>
          <a>修改</a>
          <a>删除</a>
        </div>
      </div>
    </div>

    <el-dialog
      @close="dialogClose"
      width="500px"
      :show-close="false"
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      custom-class="dialog-box">
      <div>
        <el-form
          ref="form"
          :rules="rules"
          :model="formData">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model.trim="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input
              v-model.trim="formData.account"></el-input>
          </el-form-item>
          <!--<div>-->
            <el-form-item label="银行名称" prop="bankName">
              <el-input
                v-model.trim="formData.bankName"></el-input>
            </el-form-item>
            <el-form-item
              prop="bankBranch"
              label="开户支行">
              <el-input v-model.trim="formData.bankBranch"></el-input>
            </el-form-item>
          <!--</div>-->
          <!--<div id="addType-uploader">-->
            <el-form-item label="收款码">
              <el-upload
                action=""
                :auto-upload="false"
                :on-change="imgChange"
                :show-file-list="false">
                <img v-if="img.clientURL" :src="img.clientURL" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="须知">
              <div>
                <span>请上传清晰, 识别度高的收款二维码图片, 不超过3MB</span><br>
              </div>
            </el-form-item>
          <!--</div>-->
        </el-form>
        <div class="text-right">
          <el-button
            type="primary"
            @click="submit"
            class="mar0">提交</el-button>
          <el-button
            @click="showDialog = false"
            class="mar0">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PaymentMethodsComp",
  data () {
    return {
      showDialog: true,
      formData: {
        name: '',
        account: '',
        bankName: '',
        bankBranch: '',
      },
      rules: {},
      img: {
        clientURL: '',
      }
    }
  },
  computed: {
    dialogTitle () {
      return 'dialogTitle'
    }
  },
  watch: {},
  methods: {
    dialogClose () {},
    imgChange () {},
    submit () {},
  },
  created () {
  }
}
</script>

<style scoped>
</style>
