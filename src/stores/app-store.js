import R from 'ramda'
import Tracker from './tracker'
import { persist } from 'mobx-persist'
import { observable, action, computed, when, autorun, observe, ObservableMap } from 'mobx'
import Collection from './collection'
import Exchange from './exchange'
import Holding from './exchange'

export default class AppStore {
  @observable isConnected = false

  @persist('list')
  @observable
  watchList = []

  @persist('map')
  @observable
  holdings = new Collection(Holding, 'id')

  @persist('object')
  @observable
  filter = {
    query: '',
    market: '',
  }

  @persist
  @observable
  muteNotifications = false

  @observable availableExchanges = []
  @observable exchanges = new Collection(Exchange, 'name')

  constructor() {
    this.tracker = new Tracker(this)
  }

  onConnect() {
    this.isConnected = true
    this.fetchExchanges()
    this.watchList.forEach(({ exchange, symbol }) => {
      this.fetchCandlesAndSubscribe(exchange, symbol)
    })
  }

  @computed get pairs() {
    return R.flatten(this.exchanges.values().map(e => e.pairs.values()))
  }

  onDisconnect() {
    this.isConnected = false
  }

  onEvent({ eventName, ...props }) {
    switch (eventName) {
      case 'brs':
        const { exchange, symbol, bars } = props
        this.upsertAll(exchange, symbol, bars)
        break
    }
  }

  async fetchCandlesAndSubscribe(exchange, symbol, period = 60) {
    this.fetchCandles(exchange, symbol, period)
    this.subscribe(exchange, symbol, period)
  }

  async fetchExchanges() {
    const { exchanges } = await this.tracker.request('get_exchanges')
    this.availableExchanges = R.pluck('name', exchanges)
  }

  async fetchCandles(exchange, symbol, period) {
    const num = 60
    const { bars } = await this.tracker.request('bars', { num, period, exchange, symbol, type: 'FULL' })
    this.upsertAll(exchange, symbol, bars)
  }

  @action upsertAll(exchangeName, symbolName, bars) {
    bars.forEach((bar) => { this.upsert(exchangeName, symbolName, bar) })
  }

  @action upsert(exchangeName, symbolName, bar) {
    const exchange = this.exchanges.upsert({ name: exchangeName, appStore: this })
    const pair = exchange.pairs.upsert({ exchange, symbol: symbolName })
    return pair.candles.upsert({ pair, ...bar })
  }

  async subscribe(exchange, symbol, period) {
    this.tracker.subscribe(['brs', exchange, symbol, period].join('.'))
  }

  async notify(...args) {
    if (!this.muteNotifications) {
      const notification = new Notification(...args)
      notification.onshow = () => { setTimeout(() => { notification.close() }, 5000) }
    }
  }
}
