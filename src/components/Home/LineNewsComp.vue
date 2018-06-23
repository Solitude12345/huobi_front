<template>
  <div class="comp-line-news">
    <ul class="news-menu">
      <li class="news-item link">购买VIP 买一月送一月</li>
      <li class="news-item link">火币全球专业站恢复EDU充提币及交易</li>
      <li class="news-item link">LBA交易排名赛 TOP20瓜分250万LBA</li>
      <li class="news-item link">CDC交易排名赛 日榜 TOP3 周榜TOP10瓜分888万CDC</li>
      <li class="news-item link">BKBT交易排名赛 TOP10000瓜分1800万BKBT</li>
      <li class="news-item link">PORTAL交易排名赛 TOP20瓜分60万PORTAL+10000HT</li>
      <li class="news-item link">PC交易排名赛 TOP20瓜分2000万PC</li>
      <li class="news-item link">火币全球专业站拉新返佣项目全面上线</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "line-ad"
}
</script>

<style scoped>
.comp-line-news {
  height: 60px;
  line-height: 60px;
  background-color: #181b2a;
  text-align: center;
  padding: 0 30px;
}
  .news-menu {
    height: 100%;
    overflow: hidden;
  }
  .news-item {
    display: inline-block;
  }
  .news-item:after{
    content: '/';
    margin: 0 25px;
    color: #61688a;
  }
</style>
