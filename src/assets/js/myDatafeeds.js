// import Axios from 'axios'
import wsBus from './wsBus'
// let axios = Axios.create({
//   timeout: 1000 * 30
// })

const supportedResolutions = ['1', '5', '15', '30', '60', 'D', 'W', 'M']

export default class {
  constructor (symbol) {
    // this.symbol = symbol
    this.lastBar = null
  }
  //
  async onReady (callback) {
    let config = await Promise.resolve({
      supports_search: false,
      supports_group_request: false,
      supported_resolutions: supportedResolutions,
      supports_marks: false,
    })
    callback(config)
  }

  searchSymbols (userInput, exchange, symbolType, onResultReadyCallback) {
    console.log('searchSymbols =====>\n', ...arguments)
  }

  async resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    console.log('resolveSymbol =====>\n', ...arguments)
    let res = await Promise.resolve({
      name: symbolName,
      ticker: symbolName,
      type: 'bitcoin',
      "timezone": 'Asia/Hong_Kong',
      "minmov": 1, // 最小波动
      "pricescale": 100000000, // 价格刻度
      // "minmov2": 0.0001,
      // "pointvalue": 0.00000001,
      "session": "24x7",
      "has_intraday": true,
      // "has_no_volume":false,
      // "description":"Apple Inc.",
      "supported_resolutions": supportedResolutions,
      // "intraday_multipliers": ['5', '15', '30', '60'],
      'has_empty_bars': true
    })
    onSymbolResolvedCallback(res)
  }

  async getBars (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    console.log('getBars', ...arguments)
    // let {data: res} = await axios.get(`/tv/history?symbol=AAPL&resolution=${resolution}&from=${from}&to=${to}`)
    //
    let res = await wsBus.reqKlinHistory(symbolInfo.name, resolution, from, to)
    // console.log('=========================', res)
    if (res.status !== 'ok' && res.status !== 'no_data') return onHistoryCallback([], {noData: true})
    let bars = []
    let meta = {
      noData: false,
    }

    if (res.status === 'no_data' || !res.data.length) {
      meta.noData = true;
      meta.nextTime = res.nextTime; // 如果没有数据，应该有nextTime
    } else {
      bars = res.data.map(obj => ({
        time: obj.id * 1000,
        open: obj.open,
        close: obj.close,
        high: obj.high,
        low: obj.low,
        volume: obj.vol
      }))
    }
    onHistoryCallback(bars, meta)
  }

  subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    // console.log('subscribeBars =====>\n', subscriberUID)
    wsBus.$on('subscribeBar', tick => {
      let {id, open, close, low, high, vol} = tick
      onRealtimeCallback({
        time: id * 1000,
        open,
        close,
        low,
        high,
        volume: vol
      })
    })
    // setInterval(() => {
    //   let lBar = this.lastBar
    //   let newBar = {
    //     time: lBar.time + Math.ceil(Math.random() * 1000 * 10),
    //     close: lBar.close + (Math.random() - 0.5),
    //     open: lBar.open,
    //     high: Math.max(lBar.high, lBar.close),
    //     low: Math.min(lBar.low, lBar.close),
    //   }
    //   this.lastBar = newBar
    //   onRealtimeCallback(newBar)
    // }, 500)
  }

  unsubscribeBars (subscriberUID) {
    console.log('unsubscribeBars =====>\n', ...arguments)
  }

  calculateHistoryDepth (resolution, resolutionBack, intervalBack) {
    console.log('calculateHistoryDepth =====>\n', ...arguments)
    if (+resolution > 0) {
      return {
        resolutionBack: 'D',
        intervalBack: 0.2 * resolution
      }
    } else {
      switch (resolution) {
        case 'D':
          return {
            resolutionBack: 'D',
            intervalBack: 200
          }
        case 'W':
          return {
            resolutionBack: 'M',
            intervalBack: 10
          }
      }
    }
  }

  getMarks (symbolInfo, startDate, endDate, onDataCallback, resolution) {
    console.log('getMarks =====>\n', ...arguments)
  }

  getTimescaleMarks (symbolInfo, startDate, endDate, onDataCallback, resolution) {
    console.log('getTimescaleMarks =====>\n', ...arguments)
  }

  getServerTime (callback) {
    console.log('getServerTime =====>\n', ...arguments)
  }
}
