import { observable, action, computed } from 'mobx'

import CurrencyPair from './currency-pair'

export default class Exchange {
  @observable currencyPairMap = new Map()
  @observable balances = new Map()
  @observable orders = []
  @observable orderHistory = []

  upsert(name) {
    let currencyPair = this.currencyPairMap.get(name)
    if (!currencyPair) {
      currencyPair = new CurrencyPair(this, name)
      this.currencyPairMap.set(name, currencyPair)
    }
    return currencyPair
  }

  @computed get currencyPairs() {
    return Array.from(this.currencyPairMap.values())
  }
}
