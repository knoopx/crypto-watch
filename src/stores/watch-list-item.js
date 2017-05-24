import { types } from 'mobx-state-tree'

export const WatchListItem = types.model({
  id: types.identifier(),
  exchange: types.string,
  symbol: types.string,
}, {
  setExchange(exchange) {
    this.exchange = exchange
  },
  setSymbol(symbol) {
    this.symbol = symbol
  },
})
