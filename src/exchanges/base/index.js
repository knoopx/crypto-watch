import { observable, computed } from 'mobx'
import CurrencyPair from './currency-pair'
import { symbolize, getNotificationIconURL } from 'support'

export default class Exchange {
  @observable currencyPairMap = new Map()
  @observable period = 'day'
  @observable currencyPairs = []

  constructor(appState, watchlist) {
    this.appState = appState
    this.watchlist = watchlist
    this.fetch()
    this.interval = setInterval(this.refresh, 5000)
  }

  @computed get currencyPairs() {
    return Array.from(this.currencyPairMap.values())
  }

  async fetch() {
    this.currencyPairs = this.getCurrencyPairs()
    this.refresh()
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

  alert(currencyPair, description) {
    const percentChange = `${symbolize((currencyPair.percentChange * 100).toFixed(2))}%`
    const title = `${currencyPair.name} (${currencyPair.exchange.constructor.name})`
    const body = [description, `${currencyPair.tail('close')} (${percentChange})`].join('\n')
    this.appState.notify(title, { body, icon: getNotificationIconURL(currencyPair) })
  }
}
