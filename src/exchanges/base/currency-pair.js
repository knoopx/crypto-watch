import { observable, action, computed, autorun, toJS } from 'mobx'
import { EMA, MACD } from 'technicalindicators'
import { percentChange } from 'support'

export default class CurrencyPair {
  @observable candles = []
  @observable alerts = new Map()

  constructor(exchange, base, quote) {
    this.name = [base, quote].join('/')
    this.base = base
    this.quote = quote
    this.exchange = exchange

    autorun(() => {
      this.alerts.set('▲ MACD', this.tail('macd', 2) < 0 && this.tail('macd') > 0)
      this.alerts.set('▼ MACD', this.tail('macd', 2) > 0 && this.tail('macd') < 0)
      this.alerts.set('▲ 5%', this.percentChange > 0.05)
      this.alerts.set('▼ 5%', this.percentChange < 0.05)
    })

    this.alerts.observe(({ type, name, newValue }) => {
      if (type === 'update' && newValue) {
        this.exchange.alert(this, name)
      }
    })
  }

  @action update(candles) {
    this.indicators = {
      ema20: new EMA({ period: 20, values: [] }),
      ema50: new EMA({ period: 50, values: [] }),
      macd: new MACD({ fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, values: [] }),
    }
    this.candles = candles.map(this.processCandle)
  }

  processCandle(candle) {
    const { close } = candle
    const nextmacd = this.indicators.macd.nextValue(close)
    return {
      ...candle,
      ema20: this.indicators.ema20.nextValue(close),
      ema50: this.indicators.ema50.nextValue(close),
      macd: nextmacd ? nextmacd.histogram : null,
    }
  }

  head(propName, index = 1) {
    const candle = this.candles[index]
    if (candle) {
      return candle[propName]
    }
    return 0
  }

  tail(propName, index = 1) {
    const candle = this.candles[this.candles.length - index]
    if (candle) {
      return candle[propName]
    }
    return 0
  }

  @computed get percentChange() {
    if (this.candles.length > 1) {
      return percentChange(this.head('close'), this.tail('close'))
    }
    return 0
  }
}
