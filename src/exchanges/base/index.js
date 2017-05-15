import { observable, autorun, computed, toJS } from 'mobx'
import CurrencyPair from './currency-pair'

export default class Exchange {
  @observable currencyPairMap = new Map()
  @observable period = 'day'

  constructor(watchlist) {
    this.watchlist = watchlist
    this.refresh()
    setInterval(this.refresh, 5000)
  }

  @computed get currencyPairs() {
    return Array.from(this.currencyPairMap.values())
  }

  async refresh() {
    const promises = this.watchlist.map(async (key) => {
      const currencyPair = this.upsert(key)
      const candles = await this.getCandles(currencyPair)
      currencyPair.update(candles)
    })
    return Promise.all(promises)
  }

  getStartTime() {
    return Date.now() - this.getPeriod()
  }

  getPeriod() {
    switch (this.period) {
      case 'month':
        return 2.628e+6 * 1000
      case 'week':
        return 604800 * 1000
      case 'day':
        return 86400 * 1000
      case 'hour':
        return 3600 * 1000
      default:
        throw new Error(`Unknown period: ${this.period}`)
    }
  }

  getEndTime() {
    return Date.now()
  }

  upsert(key) {
    const [base, quote] = key.split('/', 2)
    let currencyPair = this.currencyPairMap.get(key)
    if (!currencyPair) {
      currencyPair = new CurrencyPair(this, base, quote)
      this.currencyPairMap.set(key, currencyPair)
    }
    return currencyPair
  }
}
