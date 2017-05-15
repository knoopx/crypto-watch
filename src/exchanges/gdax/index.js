import { observable, computed, action } from 'mobx'

import Exchange from 'exchanges/base'

export default class GDAX extends Exchange {
  // https://docs.gdax.com/#get-historic-rates
  async getCandles(currencyPair) {
    const res = await fetch(this.buildGetCandlesURL(currencyPair))
    const json = await res.json()
    return json.map(([time, low, high, open, close, volume]) => ({ time, low, high, open, close, volume }))
  }

  buildGetCandlesURL(currencyPair) {
    const pid = [currencyPair.base, currencyPair.quote].join('-')
    const url = new URL(`https://api.gdax.com/products/${pid}/candles`)
    url.searchParams.append('start', (new Date(this.getStartTime())).toISOString())
    url.searchParams.append('end', (new Date(this.getEndTime())).toISOString())
    // const candleSize = 900
    // if (candleSize) { url.searchParams.append('granularity', candleSize) }
    return url
  }
}
