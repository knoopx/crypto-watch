import R from 'ramda'
import { types, getParent } from 'mobx-state-tree'
import { observable, autorun, computed } from 'mobx'
import { percentChange } from 'support'
import { Candle } from './candle'
import { MACD } from 'technicalindicators'

// ema20: new EMA({ period: 20, values: [] }),
// ema50: new EMA({ period: 50, values: [] }),
// macd: new MACD({ fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, values: [] }),

export const Pair = types.model({
  symbol: types.identifier(),
  candles: types.optional(types.map(Candle), {}),
  alerts: types.optional(types.map(types.boolean), {}),

  get exchange() {
    return getParent(this, 2)
  },

  get macd() {
    return MACD.calculate({ fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, values: this.candles.values().map(v => v.close) })
  },

  head(propName, index = 1) {
    const candle = this.candles.values()[index]
    if (candle) { return candle[propName] }
    return 0
  },
  tail(propName, index = 1) {
    const candle = this.candles.values()[this.candles.size - index]
    if (candle) { return candle[propName] }
    return 0.0
  },
  percentChange(propName, index = 2) {
    return percentChange(this.tail(propName, index), this.tail(propName))
  },
  get holdings() {
    return this.exchange.appStore.holdings.values().filter(h => h.exchange === this.exchange.name && h.symbol === this.symbol)
  },
  get amount() {
    R.sum(R.pluck('amount', this.holdings))
  },
  get rate() {
    return R.mean(R.pluck('rate', this.holdings))
  },
  get fee() {
    return R.sum(R.pluck('fee', this.holdings))
  },
  get cost() {
    return this.rate + this.fee
  },
  get revenuePercent() {
    return percentChange(this.amount * this.cost, this.amount * this.tail('close'))
  },
  get revenue() {
    return this.revenuePercent * this.tail('close')
  },
}, {
  afterAttach() {
    autorun(() => {
      this.alerts.set('▲', this.percentChange('close') > 0.01)
      this.alerts.set('▼', this.percentChange('close') < 0.01)
    })

    this.alerts.observe(({ type, name, newValue }) => {
      if (type === 'update' && newValue) {
        this.exchange.alert(this, name)
      }
    })
  },
})
