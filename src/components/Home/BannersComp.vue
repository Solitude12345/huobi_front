<template>
  <div class="banners-comp">
    <el-carousel trigger="click" height="560px">
      <el-carousel-item v-for="(banner, idx) in banners" :key="idx">
        <div class="banner-wrap pointer"
             @click="bannerClick(banner)"
             :style='{background: `url(${banner.bannerUrl}) center center no-repeat`}'></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "banners",
  data () {
    return {
      banners: [
        {
          bannerUrl: '/static/img/Home/huobi_banner_1.png',
          isLocalLink: false,
          linkUrl: 'https://www.huobipool.com/#!/comment-detail/msw3h8?source=proBanner'
        },
        {
          bannerUrl: '/static/img/Home/huobi_banner_2.jpg',
          isLocalLink: false,
          linkUrl: '/Account/RefererLink'
        },
        {
          bannerUrl: '/static/img/Home/huobi_banner_3.jpg',
          isLocalLink: false,
          linkUrl: '/Account/RefererLink'
        }
      ]
    }
  },
  methods: {
    bannerClick (banner) {
      banner.isLocalLink
        ? this.$router.push(banner.linkUrl)
        : window.open(banner.linkUrl)
    }
  }
}
</script>

<style scoped>
.banner-wrap {
  height: 560px;
  background-size: cover;
}
</style>
