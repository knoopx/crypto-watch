import { observable, action, computed } from 'mobx'
import { EMA } from 'technicalindicators/lib/index'
import { percentChange } from 'support'

export default class CurrencyPair {
  windowSize = 3600 * 2
  @observable history = []

  constructor(exchange, name) {
    this.name = name
    const [base, quote] = name.split('/', 2)
    this.quote = quote
    this.base = base
    this.exchange = exchange
    this.ema20 = new EMA({ period: 20, values: [] })
    this.ema50 = new EMA({ period: 50, values: [] })
  }

  @action update(price) {
    this.history.push({
      price,
      ema20: this.ema20.nextValue(price),
      ema50: this.ema50.nextValue(price),
    })

    if (this.history.length > this.windowSize) {
      this.history.shift()
    }
  }

  @computed get head() {
    return this.history[0] || { price: 0.0 }
  }

  @computed get tail() {
    return this.history[this.history.length - 1] || { price: 0.0 }
  }

  @computed get percentChange() {
    if (this.history.length > 1) {
      return percentChange(this.tail.price, this.head.price)
    }
    return 0
  }
}
