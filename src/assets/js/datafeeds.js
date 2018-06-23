/*eslint-disable*/

/**
 * Requester
 */
class Requester {
  constructor(datafeedURL, headers) {
    this.datafeedURL = datafeedURL
    this.headers = headers
  }

  sendRequest(urlPath, params) {
    return new Promise((resolve, reject) => {
      if (params !== undefined) {
        let paramKeys = Object.keys(params)
        if (paramKeys.length !== 0) {
          urlPath += '?'
        }
        urlPath += paramKeys.map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key].toString())
        }).join('&')
      }
      let xhr = new XMLHttpRequest()
      xhr.open('GET', this.datafeedURL + urlPath, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
          // console.log(xhr.responseText)
          resolve(JSON.parse(xhr.responseText))
        }
      }
      xhr.send()
    })
  }
}

/**
 * SymbolsStorage
 */
class SymbolsStorage {
  constructor(datafeedSupportedResolutions, requester) {
    // this.exchangesList = []
    // this.symbolsInfo = {}
    // this.symbolsList = []
    this.datafeedSupportedResolutions = datafeedSupportedResolutions
    this.requester = requester
    this.readyPromise = this.init()
  }

  extractField(data, field, arrayIndex) {
    let value = data[field]
    return Array.isArray(value) ? value[arrayIndex] : value
  }

  resolveSymbol(symbolName) {
    return this.readyPromise.then(() => {
      const symbolInfo = this.symbolsInfo[symbolName]
      if (symbolInfo === undefined) {
        return Promise.reject('invalid symbol')
      }
      return Promise.resolve(symbolInfo)
    })
  }

  searchSymbols(searchString, exchange, symbolType, maxSearchResults) {
    // return this.readyPromise.then(() => {
    //   const weightedResult = []
    //   const queryIsEmpty = searchString.length === 0
    //   const searchString = searchString.toUpperCase()
    //   const loop = symbolName => {
    //     const symbolInfo = this.symbolsInfo[symbolName]
    //     if (symbolInfo === undefined) {
    //       return 'continue'
    //     }
    //     if (symbolType.length > 0 && symbolInfo.type !== symbolType) {
    //       return 'continue'
    //     }
    //     if (exchange && exchange.length > 0 && symbolInfo.exchange !== exchange) {
    //       return 'continue'
    //     }
    //     const positionInName = symbolInfo.name.toUpperCase().indexOf(searchString)
    //     const positionInDescription = symbolInfo.description.toUpperCase().indexOf(searchString)
    //     if (queryIsEmpty || positionInName >= 0 || positionInDescription >= 0) {
    //       const alreadyExists = weightedResult.some(function (item) {
    //         return item.symbolInfo === symbolInfo
    //       })
    //       if (!alreadyExists) {
    //         const weight = positionInName >= 0 ? positionInName : 8000 + positionInDescription
    //         weightedResult.push({symbolInfo: symbolInfo, weight: weight})
    //       }
    //     }
    //   }
    //   for (let i = 0; i < this.symbolsList.length; i++) {
    //     const symbolName = this.symbolsList[i]
    //     loop(symbolName)
    //   }
    //   const result = weightedResult.sort((item1, item2) => item1.weight - item2.weight).slice(0, maxSearchResults)
    //     .map(function (item) {
    //       const symbolInfo = item.symbolInfo
    //       return {
    //         symbol: symbolInfo.name,
    //         full_name: symbolInfo.full_name,
    //         description: symbolInfo.description,
    //         exchange: symbolInfo.exchange,
    //         params: [],
    //         type: symbolInfo.type,
    //         ticker: symbolInfo.name
    //       }
    //     })
    //   return Promise.resolve(result)
    // })
    Promise.resolve([])
  }

  init() {
    const promises = []
    const alreadyRequestedExchanges = {}
    for (let i = 0; i < this.exchangesList.length; i++) {
      const exchange = this.exchangesList[i]
      if (alreadyRequestedExchanges[exchange]) {
        continue
      }
      alreadyRequestedExchanges[exchange] = true
      promises.push(this.requestExchangeData(exchange))
    }
    return Promise.all(promises).then(() => {
      this.symbolsList.sort()
    })
  }

  requestExchangeData(exchange) {
    return new Promise((resolve, reject) => {
      this.requester.sendRequest('/symbol_info', {group: exchange}).then(response => {
        try {
          this.onExchangeDataReceived(exchange, response)
        } catch (error) {
          reject(error)
          return false
        }
        resolve()
      })
    })
  }

  definedValueOrDefault(value, defaultValue) {
    return value !== undefined ? value : defaultValue
  }

  onExchangeDataReceived(exchange, data) {
    let symbolIndex = 0
    try {
      let symbolsCount = data.symbol.length
      let tickerPresent = data.ticker !== undefined
      for (; symbolIndex < symbolsCount; ++symbolIndex) {
        const symbolName = data.symbol[symbolIndex]
        const listedExchange = this.extractField(data, 'exchange-listed', symbolIndex)
        const tradedExchange = this.extractField(data, 'exchange-traded', symbolIndex)
        const fullName = tradedExchange + ':' + symbolName
        const ticker = tickerPresent ? this.extractField(data, 'ticker', symbolIndex) : symbolName
        const symbolInfo = {
          ticker: ticker,
          name: symbolName,
          base_name: [listedExchange + ':' + symbolName],
          full_name: fullName,
          listed_exchange: listedExchange,
          exchange: tradedExchange,
          description: this.extractField(data, 'description', symbolIndex),
          has_intraday: this.definedValueOrDefault(this.extractField(data, 'has-intraday', symbolIndex), false),
          has_no_volume: this.definedValueOrDefault(this.extractField(data, 'has-no-volume', symbolIndex), false),
          minmov: this.extractField(data, 'minmovement', symbolIndex) || this.extractField(data, 'minmov', symbolIndex) || 0,
          minmove2: this.extractField(data, 'minmove2', symbolIndex) || this.extractField(data, 'minmov2', symbolIndex),
          fractional: this.extractField(data, 'fractional', symbolIndex),
          pricescale: this.extractField(data, 'pricescale', symbolIndex),
          type: this.extractField(data, 'type', symbolIndex),
          session: this.extractField(data, 'session-regular', symbolIndex),
          timezone: this.extractField(data, 'timezone', symbolIndex),
          supported_resolutions: this.definedValueOrDefault(this.extractField(data, 'supported-resolutions', symbolIndex), this._datafeedSupportedResolutions),
          force_session_rebuild: this.extractField(data, 'force-session-rebuild', symbolIndex),
          has_daily: this.definedValueOrDefault(this.extractField(data, 'has-daily', symbolIndex), true),
          intraday_multipliers: this.definedValueOrDefault(this.extractField(data, 'intraday-multipliers', symbolIndex), ['1', '5', '15', '30', '60']),
          has_weekly_and_monthly: this.extractField(data, 'has-weekly-and-monthly', symbolIndex),
          has_empty_bars: this.extractField(data, 'has-empty-bars', symbolIndex),
          volume_precision: this.definedValueOrDefault(this.extractField(data, 'volume-precision', symbolIndex), 0)
        }
        this.symbolsInfo[ticker] = symbolInfo
        this.symbolsInfo[symbolName] = symbolInfo
        this.symbolsInfo[fullName] = symbolInfo
        this.symbolsList.push(symbolName)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * QuotesProvider
 */
class QuotesProvider {
  constructor(requester) {
    this.requester = requester
  }

  getQuotes(symbols) {
    return new Promise((resolve, reject) => {
      this.requester.sendRequest('/quotes', {symbols: symbols}).then(response => {
        if (response.s === 'ok') {
          resolve(response.d)
        } else {
          reject(response.errmsg)
        }
      })
    })
  }
}

/**
 * QuotesPulseProvider
 */
class QuotesPulseProvider {
  constructor(quotesProvider) {
    this.subscribersData = {}
    this.requestsPending = 0
    this.quotesProvider = quotesProvider
    setInterval(this.updateQuotes.bind(this, 1), 10000)
    setInterval(this.updateQuotes.bind(this, 0), 60000)
  }

  subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGuid) {
    this.subscribersData[listenerGuid] = {
      symbols: symbols,
      fastSymbols: fastSymbols,
      listener: onRealtimeCallback
    }
    console.log(this.subscribersData)
  }

  unsubscribeQuotes(listenerGuid) {
    delete this.subscribersData[listenerGuid]
  }

  updateQuotes(updateType) {
    if (this.requestsPending > 0) {
      return false
    }
    const loop = id => {
      this.requestsPending++
      const subscriptionRecord = this.subscribersData[id]
      this.quotesProvider.getQuotes(updateType === 1 ? subscriptionRecord.fastSymbols : subscriptionRecord.symbols)
        .then(data => {
          this.requestsPending--
          if (!this.subscribersData.hasOwnProperty(id)) {
            return false
          }
          subscriptionRecord.listener(data)
        }).catch(err => this.requestsPending--)
    }
    for (let listenerGuid in this.subscribersData) {
      loop(listenerGuid)
    }
  }
}

/**
 * DataPulseProvider
 */
class DataPulseProvider {
  constructor(historyProvider, updateFrequency) {
    this.subscribersData = {}
    this.requestsPending = 0
    this.historyProvider = historyProvider
    setInterval(this.updateData.bind(this), updateFrequency)
  }

  subscribeBars(symbolInfo, resolution, newDataCallback, listenerGuid) {
    if (this.subscribersData.hasOwnProperty(listenerGuid)) {
      return false
    }
    this.subscribersData[listenerGuid] = {
      lastBarTime: null,
      listener: newDataCallback,
      resolution: resolution,
      symbolInfo: symbolInfo
    }
  }

  unsubscribeBars(listenerGuid) {
    delete this.subscribersData[listenerGuid]
  }

  updateData() {
    if (this.requestsPending > 0) {
      return false
    }
    this.requestsPending = 0
    const loop = id => {
      this.requestsPending++
      this.updateDataForSubscriber(id).then(() => this.requestsPending--).catch(err => this.requestsPending--)
    }
    for (let listenerGuid in this.subscribersData) {
      loop(listenerGuid)
    }
  }

  updateDataForSubscriber(listenerGuid) {
    const subscriptionRecord = this.subscribersData[listenerGuid]
    const rangeEndTime = parseInt(Date.now() / 1000)
    const rangeStartTime = rangeEndTime - this.periodLengthSeconds(subscriptionRecord.resolution, 10)
    return this.historyProvider.getBars(subscriptionRecord.symbolInfo, subscriptionRecord.resolution, rangeStartTime, rangeEndTime)
      .then(result => this.onSubscriberDataReceived(listenerGuid, result))
  }

  onSubscriberDataReceived(listenerGuid, result) {
    if (!this.subscribersData.hasOwnProperty(listenerGuid)) {
      return false
    }
    const bars = result.bars
    if (bars.length === 0) {
      return false
    }
    const lastBar = bars[bars.length - 1]
    const subscriptionRecord = this.subscribersData[listenerGuid]
    if (subscriptionRecord.lastBarTime !== null && lastBar.time < subscriptionRecord.lastBarTime) {
      return false
    }
    const isNewBar = subscriptionRecord.lastBarTime !== null && lastBar.time > subscriptionRecord.lastBarTime
    if (isNewBar) {
      if (bars.length < 2) {
        throw new Error('Not enough bars in history for proper pulse update. Need at least 2.')
      }
      const previousBar = bars[bars.length - 2]
      subscriptionRecord.listener(previousBar)
    }
    subscriptionRecord.lastBarTime = lastBar.time
    subscriptionRecord.listener(lastBar)
  }

  periodLengthSeconds(resolution, requiredPeriodsCount) {
    let daysCount = 0
    if (resolution === 'D') {
      daysCount = requiredPeriodsCount
    } else if (resolution === 'M') {
      daysCount = 31 * requiredPeriodsCount
    } else if (resolution === 'W') {
      daysCount = 7 * requiredPeriodsCount
    } else {
      daysCount = requiredPeriodsCount * parseInt(resolution) / (24 * 60)
    }
    return daysCount * 24 * 60 * 60
  }
}

/**
 * HistoryProvider
 */

let datas = [
  {
    "t": [1496102400, 1496188800, 1496275200, 1496361600, 1496620800, 1496707200, 1496793600, 1496880000, 1496966400, 1497225600, 1497312000, 1497398400, 1497484800, 1497571200, 1497830400, 1497916800, 1498003200, 1498089600, 1498176000, 1498435200, 1498521600, 1498608000, 1498694400, 1498780800, 1499040000, 1499212800, 1499299200, 1499385600, 1499644800, 1499731200, 1499817600, 1499904000, 1499990400, 1500249600, 1500336000, 1500422400, 1500508800, 1500595200, 1500854400, 1500940800, 1501027200, 1501113600, 1501200000, 1501459200, 1501545600, 1501632000, 1501718400, 1501804800, 1502150400, 1502236800, 1502323200, 1502409600, 1502668800, 1502755200, 1502841600, 1502928000, 1503014400, 1503273600, 1503360000, 1503446400, 1503532800, 1503619200, 1503878400, 1503964800, 1504051200, 1504137600, 1504224000, 1504569600, 1504656000, 1504742400, 1504828800, 1505088000, 1505174400, 1505260800, 1505347200, 1505433600, 1505692800, 1505779200, 1505865600, 1505952000, 1506038400, 1506297600, 1506384000, 1506470400, 1506556800, 1506643200, 1506902400, 1506988800, 1507075200, 1507161600, 1507248000, 1507507200, 1507593600, 1507680000, 1507766400, 1507852800, 1508112000, 1508198400, 1508284800, 1508371200, 1508457600, 1508716800, 1508803200, 1508889600, 1508976000, 1509062400, 1509321600, 1509408000, 1509494400, 1509580800, 1509667200, 1509926400, 1510012800, 1510185600, 1510272000, 1510531200, 1510617600, 1510704000, 1510790400, 1510876800, 1511136000, 1511222400, 1511308800, 1511481600, 1511740800, 1511827200, 1511913600, 1512000000, 1512086400, 1512345600, 1512432000, 1512518400, 1512604800, 1512691200, 1512950400, 1513036800, 1513123200, 1513209600, 1513296000, 1513555200, 1513641600, 1513728000, 1513814400, 1513900800, 1514246400, 1514332800, 1514419200, 1514505600, 1514851200, 1514937600, 1515024000, 1515110400, 1515369600, 1515456000, 1515542400, 1515628800, 1515715200, 1516060800, 1516147200, 1516233600, 1516320000, 1516579200, 1516665600, 1516752000, 1516838400, 1516924800, 1517184000, 1517270400, 1517356800, 1517443200, 1517529600, 1517788800, 1517875200, 1517961600, 1518048000, 1518134400, 1518393600, 1518480000, 1518566400, 1518652800, 1518739200, 1519084800, 1519171200, 1519257600, 1519344000, 1519603200, 1519689600, 1519776000, 1519862400, 1519948800, 1520208000, 1520294400, 1520380800, 1520467200, 1520553600, 1520812800, 1520899200, 1520985600, 1521072000, 1521158400, 1521417600, 1521504000, 1521590400, 1521676800, 1521763200, 1522022400, 1522108800],
    "o": [153.42, 153.97, 153.17, 153.58, 154.34, 153.9, 155.02, 155.25, 155.19, 145.74, 147.16, 147.5, 143.32, 143.78, 143.66, 146.87, 145.52, 145.77, 145.13, 147.17, 145.01, 144.49, 144.71, 144.45, 144.88, 143.69, 143.02, 142.9, 144.11, 144.73, 145.87, 145.5, 147.97, 148.82, 149.2, 150.48, 151.5, 149.99, 150.58, 151.8, 153.35, 153.75, 149.89, 149.9, 149.1, 159.28, 157.05, 156.07, 158.6, 159.26, 159.9, 156.6, 159.32, 160.66, 161.94, 160.52, 157.86, 157.5, 158.23, 159.07, 160.43, 159.65, 160.14, 160.1, 163.8, 163.64, 164.8, 163.75, 162.71, 162.09, 160.86, 160.5, 162.61, 159.87, 158.99, 158.47, 160.11, 159.51, 157.9, 155.8, 152.02, 149.99, 151.78, 153.8, 153.89, 153.21, 154.26, 154.01, 153.63, 154.18, 154.97, 155.81, 156.055, 155.97, 156.35, 156.73, 157.9, 159.78, 160.42, 156.75, 156.61, 156.89, 156.29, 156.91, 157.23, 159.29, 163.89, 167.9, 169.87, 167.64, 174, 172.365, 173.91, 175.11, 175.11, 173.5, 173.04, 169.97, 171.18, 171.04, 170.29, 170.78, 173.36, 175.1, 175.05, 174.3, 172.63, 170.43, 169.95, 172.48, 169.06, 167.5, 169.03, 170.49, 169.2, 172.15, 172.5, 172.4, 173.63, 174.88, 175.03, 174.87, 174.17, 174.68, 170.8, 170.1, 171, 170.52, 170.16, 172.53, 172.54, 173.44, 174.35, 174.55, 173.16, 174.59, 176.18, 177.9, 176.15, 179.37, 178.61, 177.3, 177.3, 177.25, 174.505, 172, 170.16, 165.525, 166.87, 167.165, 166, 159.1, 154.83, 163.085, 160.29, 157.07, 158.5, 161.95, 163.045, 169.79, 172.36, 172.05, 172.83, 171.8, 173.67, 176.35, 179.1, 179.26, 178.54, 172.8, 175.21, 177.91, 174.94, 175.48, 177.96, 180.29, 182.59, 180.32, 178.5, 178.65, 177.32, 175.24, 175.04, 170, 168.39, 168.07, 173.68],
    "h": [154.43, 154.17, 153.33, 155.45, 154.45, 155.81, 155.98, 155.54, 155.19, 146.09, 147.45, 147.5, 144.4798, 144.5, 146.74, 146.87, 146.0693, 146.7, 147.16, 148.28, 146.16, 146.11, 145.13, 144.96, 145.3001, 144.79, 143.5, 144.75, 145.95, 145.85, 146.18, 148.49, 149.33, 150.9, 150.13, 151.42, 151.74, 150.44, 152.44, 153.84, 153.93, 153.99, 150.23, 150.33, 150.22, 159.75, 157.21, 157.4, 161.83, 161.27, 160, 158.5728, 160.21, 162.195, 162.51, 160.71, 159.5, 157.89, 160, 160.47, 160.74, 160.56, 162, 163.12, 163.89, 164.52, 164.94, 164.25, 162.99, 162.24, 161.15, 162.05, 163.96, 159.96, 159.4, 160.97, 160.5, 159.77, 158.26, 155.8, 152.27, 151.83, 153.92, 154.7189, 154.28, 154.13, 154.45, 155.09, 153.86, 155.44, 155.49, 156.73, 158, 156.98, 157.37, 157.28, 160, 160.87, 160.71, 157.08, 157.75, 157.69, 157.42, 157.55, 157.8295, 163.6, 168.07, 169.6499, 169.94, 168.5, 174.26, 174.99, 175.25, 176.095, 175.38, 174.5, 173.48, 170.3197, 171.87, 171.39, 170.56, 173.7, 175, 175.5, 175.08, 174.87, 172.92, 172.14, 171.67, 172.62, 171.52, 170.2047, 170.44, 171, 172.89, 172.39, 173.54, 173.13, 174.17, 177.2, 175.39, 175.42, 176.02, 175.424, 171.47, 170.78, 171.85, 170.59, 172.3, 174.55, 173.47, 175.37, 175.61, 175.06, 174.3, 175.4886, 177.36, 179.39, 179.25, 180.1, 179.58, 177.78, 179.44, 177.3, 174.95, 172, 170.16, 167.37, 168.4417, 168.62, 166.8, 163.88, 163.72, 163.4, 161, 157.89, 163.89, 164.75, 167.54, 173.09, 174.82, 174.26, 174.12, 173.95, 175.65, 179.39, 180.48, 180.615, 179.775, 176.3, 177.74, 178.25, 175.85, 177.12, 180, 182.39, 183.5, 180.52, 180.24, 179.12, 177.47, 176.8, 175.09, 172.68, 169.92, 173.1, 175.15],
    "l": [153.33, 152.38, 152.22, 152.89, 153.46, 153.78, 154.48, 154.4, 146.02, 142.51, 145.15, 143.84, 142.21, 142.2, 143.66, 144.94, 144.61, 145.1199, 145.11, 145.38, 143.62, 143.1601, 142.28, 143.78, 143.1, 142.7237, 142.41, 142.9, 143.37, 144.38, 144.82, 145.44, 147.33, 148.57, 148.67, 149.95, 150.19, 148.88, 149.9, 151.8, 153.06, 147.3, 149.19, 148.13, 148.41, 156.16, 155.02, 155.69, 158.27, 159.11, 154.63, 156.07, 158.75, 160.14, 160.15, 157.84, 156.72, 155.1101, 158.02, 158.88, 158.55, 159.27, 159.93, 160, 162.61, 163.48, 163.63, 160.56, 160.52, 160.36, 158.53, 159.89, 158.77, 157.91, 158.09, 158, 157.995, 158.44, 153.83, 152.75, 150.56, 149.16, 151.69, 153.54, 152.7, 152, 152.72, 153.91, 152.46, 154.05, 154.56, 155.485, 155.1, 155.75, 155.7299, 156.41, 157.65, 159.23, 159.6, 155.02, 155.96, 155.5, 156.2, 155.27, 156.78, 158.7, 163.72, 166.94, 165.61, 165.28, 171.12, 171.72, 173.6, 173.14, 174.27, 173.4, 171.18, 168.38, 170.3, 169.64, 169.56, 170.78, 173.05, 174.6459, 173.34, 171.86, 167.16, 168.44, 168.5, 169.63, 168.4, 166.46, 168.91, 168.82, 168.79, 171.461, 172, 171.65, 172.46, 174.86, 174.09, 173.25, 174.1, 174.5, 169.679, 169.71, 170.48, 169.22, 169.26, 171.96, 172.08, 173.05, 173.93, 173.41, 173, 174.49, 175.65, 176.14, 175.07, 178.25, 177.41, 176.6016, 176.82, 173.2, 170.53, 170.06, 167.07, 164.7, 166.5, 166.76, 160.1, 156, 154, 159.0685, 155.03, 150.24, 157.51, 161.65, 162.88, 169, 171.77, 171.42, 171.01, 171.71, 173.54, 176.21, 178.16, 178.05, 172.66, 172.45, 174.52, 176.13, 174.27, 175.07, 177.39, 180.21, 179.24, 177.81, 178.0701, 177.62, 173.66, 174.94, 171.26, 168.6, 164.94, 166.44, 166.92],
    "c": [153.67, 152.76, 153.18, 155.45, 153.93, 154.45, 155.37, 154.99, 148.98, 145.32, 146.59, 145.16, 144.29, 142.27, 146.34, 145.01, 145.87, 145.63, 146.35, 145.82, 143.74, 145.83, 143.68, 144.02, 143.5, 144.09, 142.73, 144.18, 145.06, 145.53, 145.74, 147.77, 149.04, 149.56, 150.08, 151.02, 150.34, 150.27, 152.09, 152.74, 153.46, 150.56, 149.5, 148.85, 150.05, 157.14, 155.57, 156.39, 160.08, 161.06, 155.27, 157.48, 159.85, 161.6, 160.95, 157.87, 157.5, 157.21, 159.78, 159.98, 159.27, 159.86, 161.47, 162.91, 163.35, 164, 164.05, 162.08, 161.91, 161.26, 158.63, 161.5, 160.82, 159.65, 158.28, 159.88, 158.67, 158.73, 156.07, 153.39, 151.89, 150.55, 153.14, 154.23, 153.28, 154.12, 153.81, 154.48, 153.4508, 155.39, 155.3, 155.84, 155.9, 156.55, 156, 156.99, 159.88, 160.47, 159.76, 155.98, 156.16, 156.17, 157.1, 156.405, 157.41, 163.05, 166.72, 169.04, 166.89, 168.11, 172.5, 174.25, 174.81, 175.88, 174.67, 173.97, 171.34, 169.08, 171.1, 170.15, 169.98, 173.14, 174.96, 174.97, 174.09, 173.07, 169.48, 171.85, 171.05, 169.8, 169.64, 169.01, 169.452, 169.37, 172.67, 171.7, 172.27, 172.22, 173.87, 176.42, 174.54, 174.35, 175.01, 175.01, 170.57, 170.6, 171.08, 169.23, 172.26, 172.23, 173.03, 175, 174.35, 174.33, 174.29, 175.28, 177.09, 176.19, 179.1, 179.26, 178.46, 177, 177.04, 174.22, 171.11, 171.51, 167.96, 166.97, 167.43, 167.78, 160.37, 157.49, 163.03, 159.54, 155.32, 155.97, 162.71, 164.34, 167.37, 172.99, 172.43, 171.85, 171.07, 172.6, 175.555, 178.97, 178.39, 178.12, 175, 176.21, 176.82, 176.67, 175.03, 176.94, 179.98, 181.72, 179.97, 178.44, 178.65, 178.02, 175.3, 175.24, 171.27, 168.845, 164.94, 172.77, 168.34],
    "v": [20034934, 23162873, 16180143, 27285861, 24803858, 26249630, 20678772, 20771367, 64176149, 71563614, 33749154, 31224203, 31348832, 49180748, 31449132, 24572170, 21064679, 18673365, 25997976, 25524661, 24423643, 21915939, 31116980, 22328979, 14276812, 20758795, 23374374, 18505351, 21030466, 18311156, 23617964, 24922788, 19961788, 23243713, 17713795, 20615419, 17053326, 24671002, 21122730, 18612649, 15172136, 32175875, 16832947, 19422655, 24725526, 69222793, 26000738, 20349532, 35775675, 25640394, 39081017, 25943187, 21754810, 27936774, 27321761, 26925694, 27012525, 26145653, 21297812, 19198189, 19029621, 25015218, 25279674, 29307862, 26973946, 26412439, 16508568, 29317054, 21179047, 21722995, 28183159, 31028926, 71139119, 44393752, 23073646, 48203642, 27939718, 20347352, 51693239, 36643382, 46114424, 43922334, 35470985, 24959552, 21896592, 25856530, 18524860, 16146388, 19844177, 21032800, 16423749, 16200129, 15456331, 16607693, 16045720, 16287608, 23894630, 18816438, 16158659, 42111326, 23612246, 21654461, 17137731, 20126554, 16751691, 43904150, 43923292, 35474672, 33100847, 32710040, 58683826, 34242566, 23910914, 28636531, 25061183, 16828025, 23588451, 28702351, 23497326, 21665811, 15974387, 24875471, 24997274, 14026519, 20536313, 25468442, 40788324, 40172368, 39590080, 32115052, 27008428, 28224357, 24469613, 23096872, 33092051, 18945457, 23142242, 20219307, 37054632, 28831533, 27078872, 23000392, 20356826, 16052615, 32968167, 21672062, 15997739, 25643711, 25048048, 28819653, 22211345, 23016177, 20134092, 21262614, 23589129, 17523256, 25039531, 29159005, 32752734, 30234512, 30827809, 26023683, 31702531, 50562257, 39661804, 37121805, 48434424, 45137026, 30984099, 38099665, 85436075, 66090446, 66625484, 50852130, 49594129, 66723743, 60560145, 32104756, 39669178, 50609595, 39638793, 33531012, 35833514, 30504116, 33329232, 36886432, 38685165, 33604574, 48801970, 38453950, 28401366, 23788506, 31703462, 23163767, 31385134, 32055405, 31168404, 29075469, 22584565, 36836456, 32804695, 19314039, 35247358, 41051076, 40248954, 36272617, 38962839],
    "s": "ok"
  },
  {
    "t": [1494892800, 1494979200, 1495065600, 1495152000, 1495411200, 1495497600, 1495584000, 1495670400, 1495756800],
    "o": [155.94, 153.6, 151.27, 153.38, 154, 154.9, 153.84, 153.73, 154],
    "h": [156.06, 154.57, 153.34, 153.98, 154.58, 154.9, 154.17, 154.35, 154.24],
    "l": [154.72, 149.71, 151.13, 152.63, 152.91, 153.31, 152.67, 153.03, 153.31],
    "c": [155.47, 150.25, 152.54, 152.96, 153.99, 153.8, 153.34, 153.87, 153.61],
    "v": [19904679, 49482818, 33159664, 26733798, 22340069, 19430358, 19118319, 19044463, 21632202],
    "s": "ok"
  },
  {
    "t": [1493078400, 1493164800, 1493251200, 1493337600, 1493596800, 1493683200, 1493769600, 1493856000, 1493942400, 1494201600, 1494288000, 1494374400, 1494460800, 1494547200, 1494806400],
    "o": [143.91, 144.47, 143.9225, 144.09, 145.1, 147.54, 145.59, 146.52, 146.76, 149.03, 153.87, 153.63, 152.45, 154.7, 156.01],
    "h": [144.9, 144.6, 144.16, 144.3, 147.2, 148.09, 147.49, 147.14, 148.98, 153.7, 154.88, 153.94, 154.07, 156.42, 156.65],
    "l": [143.87, 143.3762, 143.31, 143.27, 144.96, 146.84, 144.27, 145.81, 146.76, 149.03, 153.45, 152.11, 152.31, 154.67, 155.05],
    "c": [144.54, 143.6508, 143.79, 143.65, 146.6, 147.51, 147.06, 146.53, 148.96, 153, 153.96, 153.26, 153.95, 156.1, 155.7],
    "v": [18216472, 19614287, 13948980, 20247187, 32818760, 39752670, 45142806, 23275690, 26787359, 48339210, 35942435, 25670456, 25596687, 32221756, 25700983],
    "s": "ok"
  },
  {
    "t": [1488844800, 1488931200, 1489017600, 1489104000, 1489363200, 1489449600, 1489536000, 1489622400, 1489708800, 1489968000, 1490054400, 1490140800, 1490227200, 1490313600, 1490572800, 1490659200, 1490745600, 1490832000, 1490918400, 1491177600, 1491264000, 1491350400, 1491436800, 1491523200, 1491782400, 1491868800, 1491955200, 1492041600, 1492387200, 1492473600, 1492560000, 1492646400, 1492732800, 1492992000],
    "o": [139.06, 138.95, 138.74, 139.25, 138.85, 139.3, 139.41, 140.72, 141, 140.4, 142.11, 139.845, 141.26, 141.5, 139.39, 140.91, 143.68, 144.19, 143.72, 143.71, 143.25, 144.22, 144.29, 143.73, 143.6, 142.94, 141.6, 141.91, 141.48, 141.41, 141.88, 141.22, 142.44, 143.5],
    "h": [139.98, 139.8, 138.79, 139.3571, 139.43, 139.65, 140.7501, 141.02, 141, 141.5, 142.8, 141.6, 141.5844, 141.74, 141.22, 144.04, 144.49, 144.5, 144.27, 144.12, 144.89, 145.46, 144.52, 144.18, 143.8792, 143.35, 142.15, 142.38, 141.88, 142.04, 142, 142.92, 142.68, 143.95],
    "l": [138.79, 138.82, 137.05, 138.64, 138.82, 138.84, 139.025, 140.26, 139.89, 140.23, 139.73, 139.76, 140.61, 140.35, 138.62, 140.62, 143.19, 143.5, 143.01, 143.05, 143.17, 143.81, 143.45, 143.27, 142.9, 140.06, 141.01, 141.05, 140.87, 141.11, 140.45, 141.16, 141.85, 143.18],
    "c": [139.52, 139, 138.68, 139.14, 139.2, 138.99, 140.46, 140.69, 139.99, 141.46, 139.84, 141.42, 140.92, 140.64, 140.88, 143.8, 144.12, 143.93, 143.66, 143.7, 144.77, 144.02, 143.66, 143.34, 143.17, 141.63, 141.8, 141.05, 141.83, 141.2, 140.68, 142.44, 142.27, 143.64],
    "v": [17446297, 18707236, 22155904, 19612801, 17421717, 15309065, 25691774, 19231998, 43884952, 21542038, 39529912, 25860165, 20346301, 22395563, 23575094, 33374805, 29189955, 21207252, 19661651, 19985714, 19891354, 27717854, 21149034, 16658543, 18933397, 30379376, 20350000, 17822880, 16582094, 14697544, 17328375, 23319562, 17320928, 17116599],
    "s": "ok"
  },
  {
    "t": [1480291200, 1480377600, 1480464000, 1480550400, 1480636800, 1480896000, 1480982400, 1481068800, 1481155200, 1481241600, 1481500800, 1481587200, 1481673600],
    "o": [111.43, 110.78, 111.56, 110.365, 109.17, 110, 109.5, 109.26, 110.86, 112.31, 113.29, 113.84, 115.04],
    "h": [112.465, 112.03, 112.2, 110.94, 110.09, 110.03, 110.36, 111.19, 112.43, 114.7, 115, 115.92, 116.2],
    "l": [111.39, 110.07, 110.27, 109.03, 108.85, 108.25, 109.19, 109.16, 110.6, 112.31, 112.49, 113.75, 114.98],
    "c": [111.57, 111.46, 110.52, 109.49, 109.9, 109.11, 109.95, 111.03, 112.12, 113.95, 113.3, 115.19, 115.19],
    "v": [27193983, 28528750, 36162258, 37086862, 26527997, 34324540, 26195462, 29998719, 27068316, 34402627, 26374377, 43733811, 34031834],
    "s": "ok"
  },
]

let resPart = 0

class HistoryProvider {
  constructor(requester) {
    this.requester = requester
  }

  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate) {
    // const requestParams = {
    //   symbol: symbolInfo.ticker || '',
    //   resolution: resolution,
    //   from: rangeStartDate,
    //   to: rangeEndDate
    // }
    // return new Promise((resolve, reject) => {
    //   this.requester.sendRequest('/history', requestParams).then(response => {
    //     if (response.s !== 'ok' && response.s !== 'no_data') {
    //       reject(response.errmsg)
    //       return false
    //     }
    //     let bars = []
    //     let meta = {
    //       noData: false
    //     }
    //     if (response.s === 'no_data') {
    //       meta.noData = true
    //       meta.nextTime = response.nextTime
    //     } else {
    //       response.t.forEach((v, i) => {
    //         let barValue = {
    //           time: v * 1000,
    //           close: Number(response.c[i]),
    //           open: Number(response.o[i]),
    //           high: Number(response.h[i]),
    //           low: Number(response.l[i]),
    //           volume: Number(response.v[i])
    //         }
    //         bars.push(barValue)
    //       })
    //     }
    //     resolve({bars: bars, meta: meta})
    //   })
    // })
    let res = datas[resPart++]
    return Promise.resolve({
      bars: res.t.map((time, i) => ({
        time: time * 1000,
        close: +res.c[i],
        open: +res.o[i],
        high: +res.h[i],
        low: +res.l[i],
        volume: +res.v[i]
      }))
    },)
  }
}

/**
 * JS API
 */

class Datafeeds {
  constructor(datafeedURL, updateFrequency) {
    this.debugLog = true // 调式日记
    this.configuration = this.defaultConfiguration()
    this.symbolsStorage = null
    this.datafeedURL = datafeedURL
    this.requester = new Requester(datafeedURL)
    this.historyProvider = new HistoryProvider(this.requester)
    this.quotesProvider = new QuotesProvider(this.requester)
    this.dataPulseProvider = new DataPulseProvider(this.historyProvider, updateFrequency || 20000)
    this.quotesPulseProvider = new QuotesPulseProvider(this.quotesProvider)
    this.configurationReadyPromise = this.requestConfiguration().then(data => {
      if (data === null) {
        data = this.defaultConfiguration()
      }

      this.setupWithConfiguration(data)
    })
  }

  /**
   * 打印日记消息
   */
  logMessage() {
    if (this.debugLog) {
      console.log(...arguments)
    }
  }

  /**
   *
   * @param {*} data
   * @param {*} field
   * @param {*} arrayIndex
   */
  extractField(data, field, arrayIndex) {
    let value = data[field]
    return Array.isArray(value) ? value[arrayIndex] : value
  }

  /**
   * 默认配置
   */
  defaultConfiguration() {
    return {
      supports_search: false,
      supports_group_request: false,
      supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
      supports_marks: false,
      supports_timescale_marks: false
    }
  }

  /**
   * 此方法旨在提供填充配置数据的对象。这些数据会影响图表的行为表现
   * @param {*Function(configurationData)} callback
   */
  onReady(callback) {
    this.logMessage(' >> Call onReady:', this.configuration)
    this.configurationReadyPromise.then(() => callback(this.configuration))
  }

  /**
   * 当图表需要报价数据时将调用此函数
   * @param {*Array 商品名称数组} symbols
   * @param {*Function(array of data)} onDataCallback
   * @param {*Function(reason)} onErrorCallback
   */
  getQuotes(symbols, onDataCallback, onErrorCallback) {
    this.logMessage(' >> Call getQuotes:', symbols)
    this.quotesProvider.getQuotes(symbols).then(onDataCallback).catch(onErrorCallback)
  }

  /**
   * 交易终端当需要接收商品的实时报价时调用此功能
   * @param {*很少更新的商品数组} symbols
   * @param {*频繁更新的商品数组} fastSymbols
   * @param {*Function} onRealtimeCallback
   * @param {*监听的唯一标识符} listenerGuid
   */
  // subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGuid) {
  //   this.logMessage(' >> Call subscribeQuotes: ', symbols, fastSymbols, listenerGuid)
  //   this.quotesPulseProvider.subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGuid)
  // }

  /**
   * 交易终端当不需要再接收商品的实时报价时调用此函数
   * @param {*监听的唯一标识符} listenerGuid
   */
  // unsubscribeQuotes(listenerGuid) {
  //   this.logMessage(' >> Call unsubscribeQuotes: ', listenerGuid)
  //   this.quotesPulseProvider.unsubscribeQuotes(listenerGuid)
  // }

  /**
   * 图表库在它要请求一些历史数据的时候会调用这个函数
   * @param {*请求商品的分辨率} resolution
   * @param {*期望历史周期刻度} resolutionBack
   * @param {*数量} intervalBack
   */
  calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
    this.logMessage(' >> Call calculateHistoryDepth: ', resolution, resolutionBack, intervalBack)
    return undefined
  }

  /**
   * 图书馆调用这个函数来获得可见的K线范围的标记
   * @param {*Object 商品信息对象} symbolInfo
   * @param {*Number 时间戳、最左边请求的K线时间} startDate
   * @param {*Number 时间戳、最右边请求的K线时间} endDate
   * @param {*Function(标记数字marks)} onDataCallback
   * @param {*String 请求商品的分辨率} resolution
   */
  getMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    this.logMessage(' >> Call getMarks: ', symbolInfo, startDate, endDate, resolution)
    if (!this.configuration.supports_marks) {
      return false
    }
    const requestParams = {
      symbol: symbolInfo.ticker || '',
      from: startDate,
      to: endDate,
      resolution: resolution
    }
    this.send('/marks', requestParams).then(response => {
      if (!Array.isArray(response)) {
        const result = []
        for (let i = 0; i < response.id.length; ++i) {
          result.push({
            id: this.extractField(response, 'id', i),
            time: this.extractField(response, 'time', i),
            color: this.extractField(response, 'color', i),
            text: this.extractField(response, 'text', i),
            label: this.extractField(response, 'label', i),
            labelFontColor: this.extractField(response, 'labelFontColor', i),
            minSize: this.extractField(response, 'minSize', i)
          })
        }
        response = result
      }
      onDataCallback(response)
    }).catch(err => onDataCallback([]))
  }

  /**
   * 图表库调用此函数获取可见K线范围的时间刻度标记
   * @param {*Object 商品信息对象} symbolInfo
   * @param {*Number 时间戳、最左边请求的K线时间} startDate
   * @param {*Number 时间戳、最右边请求的K线时间} endDate
   * @param {*Function(array of marks)} onDataCallback
   * @param {*String 请求商品的分辨率} resolution
   */
  getTimescaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    this.logMessage(' >> Call getTimescaleMarks: ', symbolInfo, startDate, endDate, resolution)
    if (!this.configuration.supports_timescale_marks) {
      return false
    }
    const requestParams = {
      symbol: symbolInfo.ticker || '',
      from: startDate,
      to: endDate,
      resolution: resolution
    }
    this.send('/timescale_marks', requestParams).then(response => {
      if (!Array.isArray(response)) {
        const result = []
        for (let i = 0; i < response.id.length; ++i) {
          result.push({
            id: this.extractField(response, 'id', i),
            time: this.extractField(response, 'time', i),
            color: this.extractField(response, 'color', i),
            text: this.extractField(response, 'text', i),
            label: this.extractField(response, 'label', i),
            labelFontColor: this.extractField(response, 'labelFontColor', i),
            minSize: this.extractField(response, 'minSize', i)
          })
        }
        response = result
      }
      onDataCallback(response)
    }).catch(err => onDataCallback([]))
  }

  /**
   * 当图表需要知道服务器时间时则调用此函数
   * @param {*Function(unixTime)} callback
   */
  getServerTime(callback) {
    this.logMessage(' >> Call getServerTime: ', this.configuration.supports_time)
    if (!this.configuration.supports_time) {
      return false
    }
    this.send('/time').then(response => {
      let time = parseInt(response)
      !isNaN(time) && callback(time)
    })
  }

  /**
   * 提供一个匹配用户搜索的商品列表
   * @param {*String 用户在商品搜索框中输入的文字} userInput
   * @param {*String 请求的交易所} exchange
   * @param {*String 请求的商品类型：指数、股票、外汇等} symbolType
   * @param {*Function(result)} onResultReadyCallback
   */
  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    this.logMessage(' >> Call searchSymbols:', userInput, exchange, symbolType)
    if (this.configuration.supports_search) {
      const params = {
        limit: 30 /* SearchItemsLimit */,
        query: userInput.toUpperCase(),
        type: symbolType,
        exchange: exchange
      }
      this.send('/search', params).then(response => {
        response.s ? onResultReadyCallback([]) : onResultReadyCallback(response)
      }).catch(err => onResultReadyCallback([]))
    } else {
      this.symbolsStorage.searchSymbols(userInput, exchange, symbolType, 30).then(onResult).catch(onResult.bind(null, []))
    }
  }

  /**
   * 通过商品名称解析商品信息
   * @param {*String 商品名称或ticker} symbolName
   * @param {*Function(SymbolInfo)} onSymbolResolvedCallback
   * @param {*Function(reason)} onResolveErrorCallback
   */
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    this.logMessage(' >> Call resolveSymbol:', symbolName)
    if (!this.configuration.supports_group_request) {
      let params = {
        symbol: symbolName
      }
      this.send('/symbols', params).then(response => {
        response.s ? onResolveErrorCallback('unknown_symbol') : onSymbolResolvedCallback(response)
      }).catch(err => onResolveErrorCallback('unknown_symbol'))
    } else {
      this.symbolsStorage.resolveSymbol(symbolName).then(onSymbolResolvedCallback).catch(onResolveErrorCallback)
    }
  }

  /**
   *
   * @param {*Object 商品信息对象} symbolInfo
   * @param {*String 分辨率} resolution
   * @param {*Number 时间戳、最左边请求的K线时间} from
   * @param {*Number 时间戳、最右边请求的K线时间} to
   * @param {*Function(数组bars,meta={ noData = false })} onHistoryCallback
   * @param {*Function(reason：错误原因)} onErrorCallback
   * @param {*Boolean 以标识是否第一次调用此商品/分辨率的历史记录} firstDataRequest
   */
  getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    this.logMessage(' >> Call getBars: ', symbolInfo, resolution, from, to, firstDataRequest)
    this.historyProvider.getBars(symbolInfo, resolution, from, to).then(function (result) {
      onHistoryCallback(result.bars, result.meta)
    }).catch(onErrorCallback)
  }

  /**
   * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
   * @param {*Object 商品信息对象} symbolInfo
   * @param {*String 分辨率} resolution
   * @param {*Function(bar) bar: object{time, close, open, high, low, volume}} onRealtimeCallback
   * @param {*Object} subscriberUID
   * @param {*Function()将在bars数据发生变化时执行} onResetCacheNeededCallback
   */
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    this.logMessage(' >> Call subscribeBars: ', symbolInfo, resolution, subscriberUID)
    this.dataPulseProvider.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID)
  }

  /**
   * 取消订阅K线数据
   * @param {*Object} subscriberUID
   */
  unsubscribeBars(subscriberUID) {
    this.logMessage(' >> Call unsubscribeBars: ', subscriberUID)
    this.dataPulseProvider.unsubscribeBars(subscriberUID)
  }

  /**
   * 请求配置信息
   */
  requestConfiguration() {
    // return this.send('/config')
    return Promise.resolve({
      "supports_search": true,
      "supports_group_request": false,
      "supports_marks": false,
      "supports_timescale_marks": false,
      "supports_time": false,
      "exchanges": [
        // {
        //   "value": "",
        //   "name": "All Exchanges",
        //   "desc": ""
        // },
        // {
        //   "value": "NasdaqNM",
        //   "name": "NasdaqNM",
        //   "desc": "NasdaqNM"
        // },
        // {
        //   "value": "NYSE",
        //   "name": "NYSE",
        //   "desc": "NYSE"
        // },
        // {
        //   "value": "NCM",
        //   "name": "NCM",
        //   "desc": "NCM"
        // },
        // {
        //   "value": "NGM",
        //   "name": "NGM",
        //   "desc": "NGM"
        // }
      ],
      "supported_resolutions": ["1", "5", "15", "30", "60", "360", "720", "D", "W", "M"]
    })
  }

  /**
   * 发送请求
   * @param {*请求路径} urlPath
   * @param {*参数} params
   */
  send(urlPath, params) {
    return this.requester.sendRequest(urlPath, params)
  }

  /**
   * 安装配置
   * @param {*配置信息} configurationData
   */
  setupWithConfiguration(configurationData) {
    this.configuration = configurationData
    if (configurationData.exchanges === undefined) {
      configurationData.exchanges = []
    }
    if (!configurationData.supports_search && !configurationData.supports_group_request) {
      throw new Error('Unsupported datafeed configuration. Must either support search, or support group request')
    }
    if (configurationData.supports_group_request || !configurationData.supports_search) {
      this.symbolsStorage = new SymbolsStorage(this.datafeedURL, configurationData.supported_resolutions || [], this.requester)
    }
  }
}

export default Datafeeds
