<template>
  <div class="comp-navbar">
    <div class="clear-fix">
      <div class="fl">
        <ul class="nav-menu">
          <router-link tag="li"
                       :to="{name: 'Home'}"
                       class="nav-item link">
            <!--<img src="/static/img/laex-logo.png" alt="" height="30">-->
            首页
          </router-link>
          <router-link tag="li"
                       :to="{name: 'Trade'}"
                       class="nav-item link">
            法币交易
          </router-link>
          <router-link tag="li"
                       :to="{name: 'Pairs'}"
                       class="nav-item link">
            币币交易
          </router-link>
          <router-link tag="li"
                       :to="{name: 'Finance'}"
                       class="nav-item link">
            资产
          </router-link>
          <li class="nav-item">
            <el-popover
              trigger="hover"
              placement="bottom-start"
              :visible-arrow="false"
              :offset="-20"
              popper-class="user-center-popper">
              <span class="pointer" slot="reference">个人中心 <i class="el-icon-caret-bottom"></i></span>
              <ul>
                <router-link tag="li"
                             :to="{name: 'UserInfo'}"
                             class="sub-nav-item">账号安全</router-link>
                <router-link tag="li"
                             :to="{name: 'UserAuth'}"
                             class="sub-nav-item">身份认证</router-link>
              </ul>
            </el-popover>
          </li>

        </ul>
      </div>
      <div class="fr">
        <ul>
          <router-link tag="li"
                       :to="{name: 'Login'}"
                       class="nav-item mr-0 link">登录</router-link>
          <router-link tag="li"
                       :to="{name: 'Register'}"
                       class="nav-item link">注册</router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "navbar-comp"
}
</script>

<style scoped>
.comp-navbar{
  width: 100%;
  min-width: 1200px;
  margin: 0 auto;
  height: 56px;
  line-height: 56px;
  padding: 0 15px;
  box-sizing: border-box;
  background-color: #181b2a;
}
  .nav-item{
    display: inline-block;
    margin: 0 10px;
    padding: 0 5px;
    border: none;
  }
  .sub-nav-item{
    padding: 10px 20px;
    color: #c7cce6;
    border-bottom: 1px solid #1f2943;
    cursor: pointer;
  }
  .sub-nav-item:hover{
    background-color: #1e2235;
  }
</style>
<style>
  .user-center-popper{
    border: none;
    background-color: #262a42;
    box-shadow: 0 8px 16px rgba(0,0,0,.4);
    border-radius: 3px;
    padding: 10px 0;
    /*margin-top: 0 !important;*/
  }
</style>
