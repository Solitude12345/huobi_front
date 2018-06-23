<template>
  <div class="trade-view-comp">
    <div id="trade-view-root">
    </div>
  </div>
</template>

<script>
// import Datafeeds from '../assets/js/datafeeds'
import Datafeeds from '../assets/js/myDatafeeds'

console.log(Datafeeds)
export default {
  name: 'trade-view',
  methods: {
    tradingViewInit () {
      window.TradingView.onready(() => {
        let widget = new window.TradingView.widget({ // eslint-disable-line
          // debug: true, // uncomment this line to see Library errors and warnings in the console
          width: '100%',
          height: '100%',
          time_frames: [],
          fullscreen: false,
          symbol: 'BTC_USDT',
          interval: 'D',
          container_id: 'trade-view-root',
          datafeed: new Datafeeds('https://demo_feed.tradingview.com'),
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
            // 'items_favoriting',
            'header_layouttoggle',
            // 'chart_crosshair_menu',
            // 'open_account_manager',
            // 'study_dialog_search_control',
            'symbol_search_hot_key',
            'control_bar',
            // 'header_settings',
            // 'save_chart_properties_to_local_storage',
            'display_market_status',
          ],
          enabled_features: [
            'use_localstorage_for_settings',
            // 'study_templates',
            // 'timeframes_toolbar',
            'dont_show_boolean_study_arguments',
            'hide_last_na_study_output',
            // 'same_data_requery',
            // 'side_toolbar_in_fullscreen_mode',
            'hide_left_toolbar_by_default'
          ],
          // charts_storage_url: 'http://saveload.tradingview.com',
          charts_storage_api_version: '1.1',
          client_id: 'tradingview.com',
          user_id: 'public_user_id',
          loading_screen: {
            backgroundColor: '#262626'
          },
          toolbar_bg: '#181b2a',
          overrides: {
            volumePaneSize: "small",
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
          studies_overrides: {
          },
          custom_css_url: './night.css'
        })
        widget.onChartReady(() => {
          let chart = widget.activeChart()
          chart.createStudy('Moving Average', false, false, [5], null, {
            'Plot.color': '#965fc4',
            'Plot.linewidth': 1.5
          })
          chart.createStudy('Moving Average', false, false, [10], null, {
            'Plot.color': '#84aad5',
            'Plot.linewidth': 1.5
          })
          chart.createStudy('Moving Average', false, false, [30], null, {
            'Plot.color': '#55b263',
            'Plot.linewidth': 1.5
          })
          chart.createStudy('Moving Average', false, false, [60], null, {
            'Plot.color': '#b7248a',
            'Plot.linewidth': 1.5
          })
        })
      })
    }
  },
  mounted () {
    this.tradingViewInit()
  }
}
</script>

<style>
  #trade-view-root {
    margin: 100px auto;
    height: 500px;
    width: 1000px;
  }
</style>
