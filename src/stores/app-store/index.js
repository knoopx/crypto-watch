import { observable, action, computed, toJS } from 'mobx'
import _ from 'lodash'
import Fuzzaldrin from 'fuzzaldrin'

export default class AppStore {
  @observable exchange

  @observable filter = {
    query: '',
    market: '',
  }

  @observable currencyPairMap = new Map()

  constructor(exchanges) {
    this.exchanges = exchanges
  }

  @computed get currencyPairs() {
    return _(this.exchanges).map('currencyPairs').flatten().orderBy(['percentChange', 'quote', 'base'], ['desc', 'asc', 'asc']).value()
  }

  @computed get filteredCurrencyPairs() {
    const results = Fuzzaldrin.filter(this.currencyPairs, this.filter.query, { key: 'name' })
    return _.filter(results, _.omitBy({
      base: this.filter.market,
    }, _.isEmpty))
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
