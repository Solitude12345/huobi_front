<template>
  <div class="trade-view-comp cont-box">
    <div class="cont-title pair-title">
      <h2 class="font-20 display-ib">{{targetCoin}}/{{baseCoin}}<span class="ml-15">{{curMkt.close | sliceTo(4)}}</span></h2>
      <span class="ml-15">
        涨幅 <span :class="curMkt | changeClass">{{(curMkt.close / curMkt.open - 1) * 100 | signed}}%</span>
      </span>
      <span class="ml-15">
        高 {{curMkt.high | sliceTo(4)}}
      </span>
      <span class="ml-15">
        低 {{curMkt.low | sliceTo(4)}}
      </span>
      <span class="ml-15">
        24H量 {{curMkt.amount | sliceTo(0)}} {{targetCoin}}
      </span>
    </div>
    <div id="trade-view-root">
    </div>
  </div>
</template>

<script>
import wsBus from '@/assets/js/wsBus'
import Datafeeds from '@a/js/myDatafeeds'

import {createNamespacedHelpers} from 'vuex'
const {mapGetters, mapState} = createNamespacedHelpers('pairs')
// import Datafeeds from '../assets/js/datafeeds'

console.log(Datafeeds)
export default {
  name: 'kline-comp',
  data () {
    return {
      curMkt: {}
    }
  },
  computed: {
    ...mapState([
      'baseCoin',
      'targetCoin'
    ]),
    ...mapGetters([
      'klineSymbol'
    ])
  },
  watch: {
    klineSymbol () {
      this.tradingViewInit()
    }
  },
  methods: {
    tradingViewInit () {
        let widget = new window.TradingView.widget({ // eslint-disable-line
        // debug: true, // uncomment this line to see Library errors and warnings in the console
        width: '100%',
        height: '100%',
        fullscreen: false,
        symbol: this.klineSymbol,
        interval: localStorage.getItem('tradingview.interval') || 'D',
        container_id: 'trade-view-root',
        datafeed: new Datafeeds(this.klineSymbol),
        library_path: '/static/chartTool/',
        locale: 'zh',
        timezone: 'Asia/Hong_Kong',
        drawings_access: { type: 'black', tools: [ { name: 'Regression Trend' } ] },
        disabled_features: [
          // 'main_series_scale_menu',
          'pane_context_menu',
          'header_fullscreen_button',
          'go_to_date',
          'header_compare',
          'header_interval_dialog_button',
          'header_screenshot',
          'header_symbol_search',
          'header_undo_redo',
          // 'legend_context_menu',
          // 'show_hide_button_in_legend',
          // 'show_interval_dialog_on_key_press',
          // 'snapshot_trading_drawings',
          'symbol_info',
          'volume_force_overlay',
          'items_favoriting',
          'header_layouttoggle',
          // 'chart_crosshair_menu',
          // 'open_account_manager',
          // 'study_dialog_search_control',
          'symbol_search_hot_key',
          'control_bar',
          // 'header_settings',
          'save_chart_properties_to_local_storage',
          'display_market_status',
          'timeframes_toolbar',
          'use_localstorage_for_settings',
        ],
        enabled_features: [
          // 'study_templates',
          // 'timeframes_toolbar',
          // 'dont_show_boolean_study_arguments',
          'hide_last_na_study_output',
          // 'same_data_requery',
          // 'side_toolbar_in_fullscreen_mode',
          'hide_left_toolbar_by_default'
        ],
        studies_overrides: {
        },
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        loading_screen: {
          backgroundColor: '#181b2a'
        },
        toolbar_bg: '#181b2a',
        overrides: {
          volumePaneSize: "small",
          'paneProperties.legendProperties.showStudyValues': true,
          'paneProperties.background': '#181b2a',
          'paneProperties.vertGridProperties.color': '#1f2943',
          'paneProperties.horzGridProperties.color': '#1f2943',
          'symbolWatermarkProperties.transparency': 90,
          'scalesProperties.textColor': '#61688a',
          // 实心k
          'mainSeriesProperties.candleStyle.upColor': '#589065',
          'mainSeriesProperties.candleStyle.downColor': '#ae4e54',
          'mainSeriesProperties.candleStyle.drawWick': true,
          'mainSeriesProperties.candleStyle.drawBorder': true,
          'mainSeriesProperties.candleStyle.borderColor': '#C400CB',
          'mainSeriesProperties.candleStyle.borderUpColor': '#589065',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ae4e54',
          'mainSeriesProperties.candleStyle.wickUpColor': '#589065',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ae4e54',
          // 空心k
          'mainSeriesProperties.hollowCandleStyle.upColor': '#589065',
          'mainSeriesProperties.hollowCandleStyle.downColor': '#ae4e54',
          'mainSeriesProperties.hollowCandleStyle.drawWick': true,
          'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
          'mainSeriesProperties.hollowCandleStyle.borderColor': '#C400CB',
          'mainSeriesProperties.hollowCandleStyle.borderUpColor': '#589065',
          'mainSeriesProperties.hollowCandleStyle.borderDownColor': '#ae4e54',
          'mainSeriesProperties.hollowCandleStyle.wickUpColor': '#589065',
          'mainSeriesProperties.hollowCandleStyle.wickDownColor': '#ae4e54',
          'scalesProperties.lineColor': '#61688a',

          'paneProperties.legendProperties.showSeriesTitle': false, // 取消symbolInfo
        },
        custom_css_url: './night.css'
      })
      widget.onChartReady(() => {
        let chart = widget.activeChart()
        chart.createStudy('Moving Average', false, false, [5], null, {
          'Plot.color': '#965fc4',
          'Plot.linewidth': 1
        })
        chart.createStudy('Moving Average', false, false, [10], null, {
          'Plot.color': '#84aad5',
          'Plot.linewidth': 1
        })
        chart.createStudy('Moving Average', false, false, [30], null, {
          'Plot.color': '#55b263',
          'Plot.linewidth': 1
        })
        chart.createStudy('Moving Average', false, false, [60], null, {
          'Plot.color': '#b7248a',
          'Plot.linewidth': 1
        })
        chart.onIntervalChanged().subscribe(null, (interval, obj) => {
          localStorage.setItem('tradingview.interval', interval)
        })
      })
    }
  },
  mounted () {
    this.tradingViewInit()
  },
  created () {
    wsBus.$on('marketDetail', m => { // {amount, close, count, high, id, low, open, version, vol}
      this.curMkt = m
    })
  }
}
</script>

<style>
  #trade-view-root {
    height: 450px;
  }
  .pair-title {
    padding: 10px 15px;
  }
</style>
