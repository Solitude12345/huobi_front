<template>
  <div id="page-user-info">
    <div class="cont-box">
      <div class="cont-title">基本信息</div>
      <div>
        <div class="item">
          <div class="item-label">账号</div>
          <div class="item-info">{{mobile || email}}</div>
        </div>
        <div class="item">
          <div class="item-label">UID</div>
          <div class="item-info">{{uid}}</div>
        </div>
        <div class="item">
          <div class="item-label">昵称</div>
          <div class="item-info">{{nickname}}</div>
          <div class="item-right">
            <a @click="modifyNickname">修改</a>
          </div>
        </div>
        <div class="item">
          <div class="item-label">登录密码</div>
          <div class="item-info">**********</div>
          <div class="item-right">
            <router-link :to="{name: 'ModifyPassword'}">修改</router-link>
          </div>
        </div>
        <div class="item">
          <div class="item-label">
            <i
              v-if="!hasTradePassword"
              class="el-icon-warning color-danger mr-5"></i>
            资金密码
          </div>
          <div class="item-info">{{hasTradePassword ? '******' : '未设置'}}</div>
          <div class="item-right">
            <router-link :to="{name: 'SetTradePassword'}">
              {{hasTradePassword ? '重置' : '设置'}}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <payment-methods-comp />
    <div class="cont-box">
      <div class="cont-title">双重身份认证</div>
      <div>
        <div class="item">
          <div class="item-label">安全等级</div>
          <div class="item-info">
            <div class="bar-bg">
              <div class="bar-percent" :class="fullSafety?'w90':'w50'"></div>
            </div>
            <span class="ml-15">{{fullSafety ? '高' : '中'}}</span>
          </div>
          <div class="item-tip">
            <span v-if="!mobile">建议绑定手机</span>
            <span v-if="!email">建议绑定邮箱</span>
          </div>
        </div>
        <div class="item">
          <div class="item-label">
            <i class="mr-5"
               :class="!!email ? 'el-icon-success color-success' : 'el-icon-warning color-danger'"></i>
            邮箱
          </div>
          <div class="item-info">{{email || '未绑定'}}</div>
          <div class="item-tip">用于提币、找回密码、修改安全设置、管理API时进行安全验证。</div>
          <div class="item-right">
            <router-link :to="{name: 'BindEmail'}">
              {{!!email ? '修改' : '绑定'}}
            </router-link>
          </div>
        </div>
        <div class="item">
          <div class="item-label">
            <i class="mr-5"
               :class="!!mobile ? 'el-icon-success color-success' : 'el-icon-warning color-danger'"></i>
            手机
          </div>
          <div class="item-info">{{mobile || '未绑定'}}</div>
          <div class="item-tip">用于提币、找回密码、修改安全设置、管理API时进行安全验证。</div>
          <div class="item-right">
            <router-link :to="{name: 'BindMobile'}">
              {{!!mobile ? '修改' : '绑定'}}
            </router-link>
          </div>
        </div>

      </div>
    </div>
    <div class="cont-box">
      <div class="cont-title">登录历史</div>
      <div>
        <table class="log-table">
          <tr class="color-weak">
            <td>时间</td>
            <td>登录方式</td>
            <td>IP</td>
          </tr>
          <tbody class="log-tbody">
          <tr>
            <td>2018-06-08 17:37:27</td>
            <td>Web</td>
            <td>104.225.153.209</td>
          </tr>
          <tr>
            <td>2018-06-08 17:37:27</td>
            <td>Web</td>
            <td>104.225.153.209</td>
          </tr>
          <tr>
            <td>2018-06-08 17:37:27</td>
            <td>Web</td>
            <td>104.225.153.209</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import {mapState} from 'vuex'
import PaymentMethodsComp from '@c/UserCenter/PaymentMethodsComp'

export default {
  name: "user-info",
  components: {
    PaymentMethodsComp
  },
  data () {
    return {}
  },
  computed: {
    fullSafety () {
      return !!this.email && !!this.mobile
    },
    ...mapState('user', [
      'mobile',
      'email',
      'uid',
      'nickname',
      'hasTradePassword'
    ])
  },
  watch: {},
  methods: {
    async modifyNickname () {
      let {value} = await this.$prompt('请输入新昵称', {
        showCancelButton: false,
        closeOnClickModal: false,
        inputPattern: /^.{1,20}$/,
        inputErrorMessage: '昵称长度限制1~20位'
      })
      if (value.trim()) {
        let res = await this.$fetch('/v1/user/modify', {
          nickname: value.trim()
        })
        if (res._statusOk) {
          this.$showErrMsg('昵称修改成功')
          this.$getUserInfo()
        }
      } else {
        this.$showErrMsg('未输入新昵称，请重试')
      }
    }
  },
  created () {
    this.$getUserInfo()
  }
}
</script>

<style>
  #page-user-info .item{
    line-height: 48px;
    border-bottom: 1px solid #1f2943;
  }
  #page-user-info .item-label,
  #page-user-info .item-info,
  #page-user-info .item-tip{
  display: inline-block;
}
  #page-user-info .item-label{
  width: 15%;
}
  #page-user-info .item-info{
  width: 25%;
}
  #page-user-info .log-table{
  line-height: 40px;
}
  #page-user-info .log-tbody td{
  border-bottom: 1px solid #1f2943;
}
  #page-user-info .item-tip{
  width: 40%;
  color: #61688a;
}
  #page-user-info .item-right{
    float: right;
  }
  #page-user-info .item-right a{
    padding: 0 10px;
  }
  #page-user-info .bar-bg{
    display: inline-block;
    height: 12px;
    width: 50%;
    background-color: #1e2235;
  }
  #page-user-info .bar-percent{
    height: 12px;
    background-color: #7a98f7;
  }
</style>
