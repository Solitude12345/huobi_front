<template>
  <div>
    <div class="container-box">
      <div class="desc-part clear-fix mt-100">
        <div class="w50 fl">
          <div class="desc-block">
            <h1 class="fw-nm">全球化的数字资产配置及交易服务</h1>
            <p class="desc-text">
              遍布全球的项目拓展及运营管理体系<br>
              在多个国家和地区设有本地交易服务中心<br>
              服务超过130个国家的数百万用户
            </p>
          </div>
        </div>
        <div class="w50 fr text-center">
          <img src="/static/img/Home/home-feature_1.png" alt="" class="w50">
        </div>
      </div>
      <div class="desc-part clear-fix mt-100">
        <div class="w50 fl text-center">
          <img src="/static/img/Home/home-feature_2.png" alt="" class="w50">
        </div>
        <div class="w50 fr">
          <div class="desc-block">
            <h1 class="fw-nm">SMART-Chain资产评估模型</h1>
            <p class="desc-text">
              独立专业的区块链资产研究评估体系 <br>
              长期跟踪产业链并提供最权威中立的资产分析 <br>
              一站式的项目进度跟踪及信息披露系统
            </p>
          </div>
        </div>
      </div>
      <div class="desc-part clear-fix mt-100">
        <div class="w50 fl">
          <div class="desc-block">
            <h1 class="fw-nm">4年的数字资产安全风控经验</h1>
            <p class="desc-text">
              安全稳定运营数字资产交易所超过四年 <br>
              管理资产规模超过10亿美金，服务数百万用户 <br>
              专业分布式架构和防DDOS攻击系统 <br>
              98% 数字资产存储多重签名冷钱包
            </p>
          </div>
        </div>
        <div class="w50 fr text-center mt-100">
          <img src="/static/img/Home/home-feature_3.png" alt="" class="w50">
        </div>
      </div>
    </div>

    <div class="service-points mt-100">
      <h1 class="fw-nm text-center pv-50">
        香港
        <span class="color-666">／</span>
        首尔
        <span class="color-666">／</span>
        新加坡
        <span class="color-666">／</span>
        东京
      </h1>
      <p class="text-center font-18 opacity-7">
        <span class="line-text relative">遍布世界各地的服务中心</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "exchange-desc-comp",
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
  .mt-100{
    margin-top: 100px;
  }
.desc-block {
  margin: 90px auto;
  width: 72%;
}
  .desc-text {
    line-height: 2;
    font-size: 16px;
    color: #a7b6c8;
    margin-top: 30px;
  }
  .service-points {
    height: 412px;
    background: url("/static/img/Home/service_bg.png") center center no-repeat;
    background-size: cover;
  }
.line-text:after, .line-text:before {
  content: "";
  position: absolute;
  top: 50%;
  display: inline-block;
  height: 1px;
  width: 181px;
  background: #c7cce6;
  opacity: .3;
}
.line-text:before{
  left: -210px;
}
  .line-text:after{
    right: -210px;
  }
</style>
