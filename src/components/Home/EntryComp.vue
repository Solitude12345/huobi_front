<template>
  <div class="text-center pv-50 comp-entry">
    <h1 class="pv-20 fw-nm">马上交易</h1>
    <p class="text-center font-18 opacity-8">在全球领先的数字资产交易平台</p>
    <div class="mt-30 pv-30">
      <router-link :to="{name: 'Login'}" class="entry-login">登录</router-link>
      <router-link :to="{name: 'Register'}" class="entry-register">注册</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "entry-comp",
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
  .comp-entry{
    background-color: #202437;
  }
  .entry-login, .entry-register {
    display: inline-block;
    border: 1px solid;
    border-radius: 5px;
    padding: 12px 75px;
    color: #c7cce6;
    font-size: 16px;
    cursor: pointer;
    transition: .3s;
  }
  .entry-login{
    border-color: #c7cce6;
    margin-right: 40px;
  }
  .entry-register {
    border-color: #7a98f7;
    background-color: #7a98f7;
    color: #ffffff;
  }
  .entry-login:hover {
    background-color: rgba(0,0,0,.3);
  }
  .entry-register:hover {
    background-color: rgba(122,152,247,.7);
  }
</style>
