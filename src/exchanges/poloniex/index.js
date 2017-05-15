import { observable, computed, action } from 'mobx'
import { Connection } from 'autobahn'

import Exchange from 'exchanges/base'

export default class Poloniex extends Exchange {
  // https://poloniex.com/support/api/
  async getCandles(currencyPair) {
    const res = await fetch(this.buildGetCandlesURL(currencyPair))
    const json = await res.json()
    return json.map(({ date: time, high, low, open, close, volume }) => ({ time, high, low, open, close, volume }))
  }

  async getCurrencyPairs() {
    const res = await fetch('https://poloniex.com/public?command=returnTicker')
    const json = await res.json()
    return Object.keys(json).map(k => k.replace('_', '/'))
  }

  buildGetCandlesURL(currencyPair) {
    const startDate = Math.ceil(this.getStartTime() / 1000)
    const endDate = Math.ceil(this.getEndTime() / 1000)
    const url = new URL('https://poloniex.com/public')
    url.searchParams.append('command', 'returnChartData')
    url.searchParams.append('currencyPair', [currencyPair.base, currencyPair.quote].join('_'))
    url.searchParams.append('start', startDate)
    url.searchParams.append('period', this.getCandleSize())
    if (endDate) { url.searchParams.append('end', endDate) }
    return url
  }

  getCandleSize() {
    // const size = [300, 900, 1800, 7200, 14400, 86400]
    return 300
    return {
      month: 14400,
      year: 7200,
      week: 1800,
      day: 900,
      hour: 300,
    }[this.period]
  }

}
