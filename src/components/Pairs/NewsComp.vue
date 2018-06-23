<template>
  <div class="cont-box">
    <div class="cont-title">
      <strong>公告</strong>
    </div>
    <div class="ph-15 font-12">
      <div class="news-item"
           v-for="(news,idx) in newsList"
           :key="idx">
        <div class="pb-5"><span class="link">{{news.title}}</span></div>
        <div class="news-time">{{news.time}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "news-comp",
  data () {
    return {
      newsList: [
        {
          title: '充EOS，炒短线行情，瓜分10000HT',
          time: '2018-05-30 12:07:42'
        },
        {
          title: '充EOS，炒短线行情，瓜分10000HT',
          time: '2018-05-30 12:07:42'
        },
        {
          title: '充EOS，炒短线行情，瓜分10000HT',
          time: '2018-05-30 12:07:42'
        },
        {
          title: '充EOS，炒短线行情，瓜分10000HT',
          time: '2018-05-30 12:07:42'
        },
        {
          title: '充EOS，炒短线行情，瓜分10000HT',
          time: '2018-05-30 12:07:42'
        },
        {
          title: '充EOS，炒短线行情，瓜分10000HT',
          time: '2018-05-30 12:07:42'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created () {
  }
}
</script>

<style scoped>
  .news-item{
    padding: 18px 0 10px;
    border-bottom: 1px solid #1e2235;
  }
  .news-time{
    text-align: right;
    color: #61688a;
  }
</style>
