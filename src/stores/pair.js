import R from 'ramda'
import { observable, autorun, computed } from 'mobx'
import { percentChange } from 'support'
import Collection from './collection'
import Candle from './candle'

export default class Pair {
  @observable candles = new Collection(Candle, 'minTime')
  @observable alerts = new Map()

  constructor() {
    // ema20: new EMA({ period: 20, values: [] }),
    // ema50: new EMA({ period: 50, values: [] }),
    // macd: new MACD({ fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, values: [] }),
    autorun(() => {
      this.alerts.set('▲', this.percentChange(2) > 0.01)
      this.alerts.set('▼', this.percentChange(2) < 0.01)
    })

    this.alerts.observe(({ type, name, newValue }) => {
      if (type === 'update' && newValue) {
        this.exchange.alert(this, name)
      }
    })
  }

  head(propName, index = 1) {
    const candle = this.candles.values()[index]
    if (candle) { return candle[propName] }
    return 0
  }

  tail(propName, index = 1) {
    const candle = this.candles.values()[this.candles.size - index]
    if (candle) { return candle[propName] }
    return 0.0
  }

  percentChange(index) {
    return percentChange(this.tail('close', index), this.tail('close'))
  }

  @computed get holdings() {
    return this.exchange.appStore.holdings.values().filter(h => h.exchange === this.exchange.name)
  }

  @computed get amount() {
    R.sum(R.pluck('amount', this.holdings))
  }

  @computed get rate() {
    return R.mean(R.pluck('rate', this.holdings))
  }

  @computed get fee() {
    return R.sum(R.pluck('fee', this.holdings))
  }

  @computed get cost() {
    return this.rate + this.fee
  }

  @computed get revenuePercent() {
    return percentChange(this.amount * this.cost, this.amount * this.tail('close'))
  }

  @computed get revenue() {
    return this.revenuePercent * pair.tail('close')
  }
}
