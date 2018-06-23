<template>
  <div class="trade-user-info-comp">
    <ul>
      <li>
        <dl>
          <dt>我的单数</dt>
          <dd>103</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>我的完成率</dt>
          <dd>95.15%</dd>
        </dl>
      </li>
    </ul>
    <ul class="ml-40">
      <li>USDT</li>
      <li>
        <dl>
          <dt>可用</dt>
          <dd>8888.12345678</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>冻结</dt>
          <dd>666.87654321</dd>
        </dl>
      </li>
    </ul>
    <ul class="fr">
      <li>
        <span>资金划转</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "trade-user-info-comp",
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
.trade-user-info-comp{
  background-color: #f6f6f6;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  padding: 0 20px;
}
ul,li,dl,dt,dd {
  display: inline-block;
}
dl {
  margin: 0 15px;
}
dt{
  color: gray;
}
  dd{
    margin-left: 10px;
  }
  .ml-40{
    margin-left: 40px;
  }
</style>
