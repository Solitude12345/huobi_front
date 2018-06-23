<template>
  <div class="">
    <ul class="box-head">
      <li class="link is-active">未完成订单</li>
      <li class="link">已完成订单</li>
      <li class="link">取消订单</li>
      <li class="fr">
        <a class="color-primary">收付款设置</a>
      </li>
    </ul>
    <div>
      <table class="trade-order-table">
        <thead>
        <tr>
          <th>订单号</th>
          <th>类型</th>
          <th>状态</th>
          <th>币种对</th>
          <th>价格</th>
          <th>数量</th>
          <th>金额</th>
          <th>下单时间</th>
        </tr>
        </thead>
        <tbody class="text-center">
        <tr>
          <td>1456789243857</td>
          <td>卖出</td>
          <td>交易完成</td>
          <td>USDT/CNY</td>
          <td>6.42CNY</td>
          <td>2500USDT</td>
          <td>16050.00CNY</td>
          <td>2018-06-08 12:13:09</td>
        </tr>
        <tr>
          <td>1456789243857</td>
          <td>卖出</td>
          <td>交易完成</td>
          <td>USDT/CNY</td>
          <td>6.42CNY</td>
          <td>2500USDT</td>
          <td>16050.00CNY</td>
          <td>2018-06-08 12:13:09</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "user-trade-orders-comp",
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
.box-head{
  border-bottom: 1px solid lightgray;
  margin-bottom: 10px;
}
  .link{
    position: relative;
    bottom: -1px;
    padding: 0 15px 10px;
  }
  th {
    font-weight: normal;
    color: #666666;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  thead>tr{
    background-color: #f5f5f5;
  }
  tbody{
    line-height: 40px;
  }
  tbody td {
    border-bottom: 1px solid #e0e0e0;
  }
</style>
