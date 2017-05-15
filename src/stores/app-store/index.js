import _ from 'lodash'
import Fuzzaldrin from 'fuzzaldrin'
import { persist } from 'mobx-persist'
import { observable, action, computed, autorun, untracked } from 'mobx'

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

  constructor() {
    autorun(() => {
      this.currencyPairsPendingNotification.forEach((currencyPair) => { currencyPair.triggerNotification() })
    })
  }

  @computed get currencyPairsPendingNotification() {
    if (this.muteNotifications) { return [] }
    return this.currencyPairs.filter(currencyPair => currencyPair.shouldTriggerNotification)
  }

  @computed get exchanges() {
    return _.chain(this.watchList)
      .groupBy('exchange')
      .entries()
      .map(([name, values]) => [this.getExchangeClass(name), _.map(values, 'currencyPair')])
      .filter(([klass]) => _.isObject(klass))
      .map(([Klass, watchList]) => new Klass(watchList))
      .value()
  }

  getExchangeClass(name) {
    return _.find(this.availableExchanges, { name })
  }

  @computed get currencyPairs() {
    return _.chain(this.exchanges)
      .map('currencyPairs')
      .flatten()
      .orderBy(['percentChange', 'quote', 'base'], ['desc', 'asc', 'asc'])
      .value()
  }

  @computed get filteredCurrencyPairs() {
    const results = Fuzzaldrin.filter(this.currencyPairs, this.filter.query, { key: 'name' })
    return _.filter(results, _.omitBy({ base: this.filter.market }, _.isEmpty))
  }

  @computed get markets() {
    return _.chain(this.currencyPairs).map('base').uniq().sort().value()
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
}
