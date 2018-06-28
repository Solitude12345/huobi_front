<template>
  <div class="page-container" id="page-finance">
    <div class="page-title cont-box">
      {{$route.name}}
    </div>
    <div class="clear-fix">
      <div class="w20 fl pr-20 border-box">
        <div class="cont-box pv-5">
          <ul class="finance-menu">
            <router-link tag="li"
                         :to="{name: 'CtcWallet'}">币币账户</router-link>
            <router-link tag="li"
                         :to="{name: 'OtcWallet'}">法币账户</router-link>
          </ul>
        </div>
      </div>
      <div class="w80 fr">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "finance"
}
</script>

<style>
  .finance-menu {
    height: 350px;
  }
  .finance-menu>li {
    cursor: pointer;
    line-height: 50px;
    margin: 0 -25px;
    padding: 0 25px;
    transition: .2s;
  }
  .finance-menu>.router-link-exact-active{
    background-color: #262a42;
  }
  #page-finance th{
    text-align: left;
    font-weight: normal;
  }
  #page-finance .finance-table{
    padding: 0 20px 10px;
    line-height: 40px;
  }
  #page-finance tbody>tr:hover,#page-finance .is-active {
    background-color: #1e2235;
  }
  #page-finance .trans-tr:hover{
    background-color: transparent;
  }
  #page-finance th, #page-finance td {
    border-bottom: 1px solid #1f2943;
    padding: 0 15px;
  }
  #page-finance .operation>a{
    padding:5px 10px 5px 0;
    margin-right: 5px;
  }
  #page-finance .trans-in-box,
  #page-finance .trans-out-box,
  #page-finance .trans-distribution-box  {
    margin: -1px -18px;
    min-height: 200px;
    position: relative;
    border-radius: 3px;
    border: 1px solid #1f2943;
    padding: 15px 20px;
    line-height: 1;
    color: #61688a;
    font-size: 13px;
    background-color: transparent;
  }
  #page-finance .finance-table p{
    line-height: 2;
  }
  #page-finance .angle {
    position: absolute;
    top: -14px;
    border: 7px solid transparent;
    border-bottom-color: #1f2943;
    display: block;
  }
  #page-finance i.angle:after {
    content: "";
    position: absolute;
    top: -5px;
    left: -7px;
    border: 7px solid transparent;
    border-bottom-color: #181b2a;
  }
  #page-finance .trans-in-box>.angle{
    right: 26%;
  }
  #page-finance .trans-out-box>.angle{
    right: 21%;
  }
  #page-finance .trans-distribution-box>.angle{
    right: 24%;
  }
  #page-finance .coin-addr{
    font-size: 20px;
    color: #c7cce6;
    display: inline-block;
  }
  .trans-out-box .el-form-item__label {
    line-height: 30px;
  }
  .trans-out-box .el-input__inner,
  .trans-distribution-box .el-input__inner{
    height: 48px;
    background-color: #1e2235;
    font-size: 16px;
  }
</style>
