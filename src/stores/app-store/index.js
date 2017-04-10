import { observable, action, computed, toJS } from 'mobx'
import { observer } from 'mobx-react'
import _ from 'lodash'
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
    return _.orderBy(Array.from(this.exchange.currencyPairMap.values()), ['speed', 'percentChange'], ['desc', 'desc'])
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
