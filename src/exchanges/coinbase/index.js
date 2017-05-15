import { observable, computed, action } from 'mobx'
import _ from 'lodash'

import Exchange from 'exchanges/base'

export default class Coinbase extends Exchange {
  async getCandles(currencyPair) {
    const headers = new Headers()
    headers.append('cb-version', '2016-08-03')
    const res = await fetch(this.buildGetCandlesURL(currencyPair), { headers })
    const json = await res.json()
    const candles = json.data.prices.map(({ price, time }) => ({ time: new Date(time), close: parseFloat(price) }))
    return _.orderBy(candles, 'time', 'asc')
  }

  buildGetCandlesURL(currencyPair) {
    const pid = [currencyPair.quote, currencyPair.base].join('-')
    const url = new URL(`https://www.coinbase.com/api/v2/prices/${pid}/historic`)
    url.searchParams.append('period', this.period)
    return url
  }
}
