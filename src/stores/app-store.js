import R from 'ramda'
import { types } from 'mobx-state-tree'

import Tracker from './tracker'
import { Exchange } from './exchange'
import { Holding } from './holding'
import { Pair } from './pair'
import { WatchListItem } from './watch-list-item'

const Filter = types.model({
  query: types.string,
  market: types.string,
})

export const AppStore = types.model({
  isConnected: false,
  muteNotifications: false,
  filter: types.optional(Filter, {
    query: '',
    market: '',
  }),
  watchList: types.optional(types.map(WatchListItem), {}),
  // holdings: types.array(Holding),
  availableExchanges: types.optional(types.array(types.string), []),
  exchanges: types.optional(types.map(Exchange), {}),

  get pairs() {
    return R.flatten(this.exchanges.values().map(e => e.pairs.values()))
  },
},
  {
    addWatchListItem(item) {
      this.watchList.put(item)
    },
    afterCreate() {
      this.tracker = new Tracker(this)
    },

    onConnect() {
      this.isConnected = true
      this.fetchExchanges()
      this.watchList.forEach(({ exchange, symbol }) => {
        this.fetchCandlesAndSubscribe(exchange, symbol)
      })
    },

    onDisconnect() {
      this.isConnected = false
    },

    onEvent({ eventName, ...props }) {
      switch (eventName) {
        case 'brs':
          const { exchange, symbol, bars } = props
          this.upsertAll(exchange, symbol, bars)
          break
      }
    },

    async fetchCandlesAndSubscribe(exchange, symbol, period = 60) {
      this.fetchCandles(exchange, symbol, period)
      this.subscribe(exchange, symbol, period)
    },

    async fetchExchanges() {
      const { exchanges } = await this.tracker.request('get_exchanges')
      this.setAvailableExchanges(R.pluck('name', exchanges))
    },

    setAvailableExchanges(availableExchanges) {
      this.availableExchanges = availableExchanges
    },

    async fetchCandles(exchange, symbol, period) {
      const num = 60
      const { bars } = await this.tracker.request('bars', { num, period, exchange, symbol, type: 'FULL' })
      this.upsertAll(exchange, symbol, bars)
    },

    upsertAll(exchangeName, symbolName, bars) {
      bars.forEach((bar) => { this.upsert(exchangeName, symbolName, bar) })
    },

    upsert(exchangeName, symbolName, bar) {
      const exchange = this.exchanges.get(exchangeName) || Exchange.create({ name: exchangeName })
      this.exchanges.put(exchange)
      const pair = exchange.pairs.get(symbolName) || Pair.create({ symbol: symbolName })
      exchange.pairs.put(pair)
      const { minTime, ...rest } = bar
      return pair.candles.put({ minTime: String(minTime), ...rest })
    },

    async subscribe(exchange, symbol, period) {
      this.tracker.subscribe(['brs', exchange, symbol, period].join('.'))
    },

    async notify(...args) {
      if (!this.muteNotifications) {
        const notification = new Notification(...args)
        notification.onshow = () => { setTimeout(() => { notification.close() }, 5000) }
      }
    },
  })
