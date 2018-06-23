<template>
  <span>
    {{validPart}}<span class="color-weak">{{zeroPart}}</span>
  </span>
</template>

<script>
export default {
  name: "obvious-price-comp",
  props: ['value'],
  data () {
    return {
      validPart: '',
      zeroPart: ''
    }
  },
  computed: {},
  watch: {
    value: {
      handler () {
        if (Number.isNaN(+this.value)) {
          this.validPart = '--'
          return
        }
        let validPart = (+this.value).toFixed(8).replace(/0+$/, '')
        !~validPart.indexOf('.') && (validPart += '.')
        this.validPart = validPart
        let zeroLength = ('' + this.value).length - validPart.length
        this.zeroPart = '00000000'.slice(0, zeroLength)
      },
      immediate: true
    }
  },
  methods: {},
  created () {
  }
}
</script>

<style scoped>

</style>
