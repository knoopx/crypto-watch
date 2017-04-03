import { observable, action, computed, toJS } from 'mobx'
import { observer } from 'mobx-react'
import _ from 'lodash'
import { flow, map, uniq, sortBy, filter } from 'lodash/fp'
import Exchange from './exchange'
import Fuzzaldrin from 'fuzzaldrin'

export default class AppStore {
  exchange = new Exchange()

  @observable filter = {
    query: '',
    market: '',
  }

  @observable currencyPairMap = new Map()

  constructor() {
    this.exchange.connect()
  }

  @computed get currencyPairs() {
    return sortBy(c => -c.percentChange)(Array.from(this.exchange.currencyPairMap.values()))
  }

  @computed get filteredCurrencyPairs() {
    const results = Fuzzaldrin.filter(this.currencyPairs, this.filter.query, { key: 'name' })
    return _.filter(results, _.omitBy({
      base: this.filter.market,
    }, _.isEmpty))
  }

  @computed get markets() {
    return _(this.currencyPairs).map('base').uniq().sort().value()
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
