<template>
  <div>
    <div class="cont-box">
      <div class="cont-title">基本信息</div>
      <div>
        <div class="item">
          <div class="item-label">账号：</div>
          <div class="item-info">150****6904</div>
        </div>
        <div class="item">
          <div class="item-label">UID：</div>
          <div class="item-info">15884239</div>
        </div>
        <div class="item">
          <div class="item-label">登录密码：</div>
          <div class="item-info">********</div>
          <div class="item-right"></div>
        </div>

      </div>
    </div>
    <div class="cont-box">
      <div class="cont-title">双重身份认证</div>
      <div>
        <div class="item">
          <div class="item-label">安全等级：</div>
          <div class="item-info">
            <div class="bar-bg">
              <div class="bar-percent"></div>
            </div> 中
          </div>
          <div class="item-tip">建议绑定手机</div>
        </div>
        <div class="item">
          <div class="item-label"><i class="el-icon-success color-success mr-5"></i>邮箱</div>
          <div class="item-info">371****@qq.com</div>
          <div class="item-tip">用于提币、找回密码、修改安全设置、管理API时进行安全验证。</div>
          <div class="item-right"><a>关闭验证</a></div>
        </div>
        <div class="item">
          <div class="item-label"><i class="el-icon-warning color-danger mr-5"></i>手机</div>
          <div class="item-info">150****6904</div>
          <div class="item-tip">用于提币、找回密码、修改安全设置、管理API时进行安全验证。</div>
          <div class="item-right">
            <a>修改</a>
            <a>关闭验证</a>
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
export default {
  name: "user-info",
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
  .item{
    line-height: 48px;
    border-bottom: 1px solid #1f2943;
  }
.item-label,.item-info,.item-tip{
  display: inline-block;
}
.item-label{
  width: 15%;
}
.item-info{
  width: 25%;
}
.log-table{
  line-height: 40px;
}
.log-tbody td{
  border-bottom: 1px solid #1f2943;
}
.item-tip{
  width: 40%;
  color: #61688a;
}
  .item-right{
    float: right;
  }
  .item-right a{
    padding: 0 10px;
  }
  .bar-bg{
    display: inline-block;
    height: 12px;
    width: 50%;
    background-color: #1e2235;
  }
  .bar-percent{
    height: 12px;
    width: 50%;
    background-color: #7a98f7;
  }
</style>
