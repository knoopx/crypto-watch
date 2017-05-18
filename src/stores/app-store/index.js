import R from 'ramda'
import Fuzzaldrin from 'fuzzaldrin'
import { persist } from 'mobx-persist'
import { observable, action, computed, autorun, observe } from 'mobx'
import exchanges from 'exchanges'

export default class AppStore {
  @persist('list')
  @observable
  watchList = []

  @persist('list')
  @observable
  holdings = []

  @persist('object')
  @observable
  filter = {
    query: '',
    market: '',
  }

  @persist
  @observable
  muteNotifications = false

  @observable
  currencyPairMap = new Map()

  availableExchanges = exchanges

  @computed get exchanges() {
    return R.pipe(
      R.groupBy(R.prop('exchange')),
      R.toPairs,
      R.map(([name, entries]) => [this.getExchangeClass(name), R.pluck('currencyPair', entries)]),
      R.reject(R.pipe(R.head, R.isNil)),
      R.map(([Class, watchList]) => new Class(this, watchList)),
    )(this.watchList)
  }

  getExchange(name) {
    return R.find(R.propEq('name', name), this.exchanges)
  }

  getExchangeClass(name) {
    return R.find(R.propEq('name', name), this.availableExchanges)
  }

  @computed get currencyPairs() {
    return R.pipe(
        R.map(R.prop('currencyPairs')),
        R.flatten,
        R.sortWith([
          R.descend(R.prop('percentChange')),
          R.prop('quote'),
          R.prop('base'),
        ]),
      )(this.exchanges)
  }

  @computed get filteredCurrencyPairs() {
    const results = Fuzzaldrin.filter(this.currencyPairs, this.filter.query, { key: 'name' })
    if (R.isEmpty(this.filter.market)) { return results }
    return results.filter(R.propName('base', this.filter.market))
  }

  @computed get markets() {
    return R.pipe(R.pluck('base'), R.uniq, Array.sort)(this.currencyPairs)
  }

  @action setQuery = (query) => {
    this.filter.query = query
  }

  @action toggleMarket = (market) => {
    if (this.filter.market === market) {
      this.filter.market = ''
    } else {
      this.filter.market = market
    }
  }

  async notify(...args) {
    if (!this.muteNotifications) {
      const notification = new Notification(...args)
      notification.onshow = () => { setTimeout(() => { notification.close() }, 5000) }
    }
  }
}
