import Axios from 'axios'
import { observable, action, computed, toJS } from 'mobx'
import { Connection } from 'autobahn'

export default class CurrencyPair {
  @observable buffer = []
  @observable history = []
  @observable isBackfilled = false

  constructor(exchange, name) {
    this.name = name
    const [base, quote] = name.split('_', 2)
    this.quote = quote
    this.base = base
    this.exchange = exchange
    this.lastCandleDate = Date.now()
    this.backfill()
  }

  @action update(ticker) {
    const now = Date.now()
    if ((now - this.lastCandleDate) / 1000 > this.exchange.candleSize) {
      this.history.push(this.current)
      this.buffer = []
      this.lastCandleDate = now
    }
    this.buffer.push(ticker.last)
  }

  @computed get current() {
    return {
      open: this.buffer[0],
      close: this.buffer[this.buffer.length - 1],
      high: Math.max(...this.buffer),
      low: Math.min(...this.buffer),
      volume: 0,
      date: new Date(this.lastCandleDate),
    }
  }

  @computed get candleSticks() {
    return [...toJS(this.history), this.current]
  }

  @computed get last() {
    return this.buffer[this.buffer.length - 1]
  }

  @computed get percentChange() {
    if (this.candleSticks.length > 1) {
      const first = this.candleSticks[this.candleSticks.length - 4]
      const last = this.candleSticks[this.candleSticks.length - 1]
      return (last.close - first.open) / first.open
    }
    return 0
  }

  async backfill() {
    const history = await this.exchange.getHistory(this)
    this.history = [...history, ...this.history]
    this.isBackfilled = true
  }
}
