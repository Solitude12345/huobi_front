<template>
  <div class="banners-comp">
    <el-carousel
      arrow="never"
      :interval="4000"
      trigger="click"
      height="560px">
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
          bannerUrl: '/static/img/Home/leax/banner1.jpg',
          isLocalLink: false,
          linkUrl: ''
        },
        {
          bannerUrl: '/static/img/Home/leax/banner2.jpg',
          isLocalLink: false,
          linkUrl: ''
        },
        {
          bannerUrl: '/static/img/Home/leax/banner3.jpg',
          isLocalLink: false,
          linkUrl: ''
        }
      ]
    }
  },
  methods: {
    bannerClick (banner) {
      if (banner.linkUrl) {
        banner.isLocalLink
          ? this.$router.push(banner.linkUrl)
          : window.open(banner.linkUrl)
      }
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
