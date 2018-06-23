<template>
  <div class="cont-box">
    <div class="cont-title">币种资料</div>
    <div class="pd-20">
      <div class="clear-fix">
        <div class="fl w35 border-box pl-10">
          <h2 class="color-weak fw-nm">BTC</h2>
          <p>比特币 ( Bitcoin )</p>
          <div class="divider"></div>
          <p class="color-weak mb-0">简介</p>
          <p>比特币（Bitcoin，简称BTC）是目前使用最为广泛的一种数字货币，它诞生于2009年1月3日，是一种点对点（P2P）传输的数字加密货币，总量2100万枚。比特币网络每10分钟释放出一定数量币，预计在2140年达到极限。比特币被投资者称为“数字黄金”。比特币依据特定算法，通过大量的计算产生，不依靠特定货币机构发行，其使用整个P2P网络中众多节点构成的分布式数据库来确认并记录所有的交易行为，并使用密码学设计确保货币流通各个环节安全性，可确保无法通过大量制造比特币来人为操控币值。基于密码学的设计可以使比特币只能被真实拥有者转移、支付及兑现。同样确保了货币所有权与流通交易的匿名性。</p>
        </div>
        <div class="fr w50">
          <div class="desc-item">
            <div class="desc-label">发行时间</div>
            <div class="desc-cont">
              2008/11/1
            </div>
          </div>
          <div class="desc-item">
            <div class="desc-label">发行总量</div>
            <div class="desc-cont">
              2100万
            </div>
          </div>
          <div class="desc-item">
            <div class="desc-label">流通总量</div>
            <div class="desc-cont">
              1673.82万
            </div>
          </div>
          <div class="desc-item">
            <div class="desc-label">众筹价格</div>
            <div class="desc-cont">
              --
            </div>
          </div>
          <div class="desc-item">
            <div class="desc-label">白皮书</div>
            <div class="desc-cont">
              <a class="color-primary" href="https://bitcoin.org/bitcoin.pdf">
                https://bitcoin.org/bitcoin.pdf
              </a>
            </div>
          </div>
          <div class="desc-item">
            <div class="desc-label">官网</div>
            <div class="desc-cont">
              <a class="color-primary" href="https://bitcoin.org/en/">
                https://bitcoin.org/en/
              </a>
            </div>
          </div>
          <div class="desc-item">
            <div class="desc-label">区块查询</div>
            <div class="desc-cont">
              <a class="color-primary" href="https://blockchain.info/">
                https://blockchain.info/
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "coin-info-comp",
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
.divider{
  border-top-color: #1f2943;
}
  .desc-item{
    padding: 15px 0;
    border-bottom: 1px solid #1f2943;
  }
  .desc-label,.desc-cont {
    display: inline-block;
  }
  .desc-label {
    width: 100px;
    color: #61688a;
  }
</style>
