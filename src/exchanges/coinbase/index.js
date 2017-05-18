import R from 'ramda'
import { observable, computed, action } from 'mobx'

import Exchange from 'exchanges/base'

export default class Coinbase extends Exchange {
  async getCandles(currencyPair) {
    const headers = new Headers()
    headers.append('cb-version', '2016-08-03')
    const res = await fetch(this.buildGetCandlesURL(currencyPair), { headers })
    const json = await res.json()
    const candles = json.data.prices.map(({ price, time }) => ({ time: new Date(time), close: parseFloat(price) }))
    return R.sortBy(R.prop('time'), candles)
  }

  getCurrencyPairs() {
    return ['BTC/EUR', 'EUR/BTC']
  }

  buildGetCandlesURL(currencyPair) {
    const pid = [currencyPair.quote, currencyPair.base].join('-')
    const url = new URL(`https://www.coinbase.com/api/v2/prices/${pid}/historic`)
    url.searchParams.append('period', this.period)
    return url
  }
}
