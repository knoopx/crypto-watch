import R from 'ramda'
import { observable, action, computed, autorun, toJS } from 'mobx'
import { EMA, MACD } from 'technicalindicators/lib/index'
import { percentChange } from 'support'
import CloseLine from 'app/ui/close-line'
import React from 'react'
import { render } from 'react-dom'
import { symbolize, summarize, renderSVG } from 'support'

export default class CurrencyPair {
  @observable candles = []
  @observable alerts = new Map()

  constructor(exchange, base, quote) {
    this.name = [base, quote].join('/')
    this.base = base
    this.quote = quote
    this.exchange = exchange

    autorun(() => {
      this.alerts.set('MACD UP', this.tail('macd', 2) < 0 && this.tail('macd') > 0)
      this.alerts.set('MACD DOWN', this.tail('macd', 2) > 0 && this.tail('macd') < 0)
      // this.alerts.set('CHANGE 5%', Math.abs(this.percentChange) > 0.05)
    })
  }

  @computed get shouldTriggerNotification() {
    return this.alerts.keys().some(key => this.alerts.get(key) === true)
  }

  async triggerNotification() {
    const node = document.createElement('div')
    render(<CloseLine width={70} height={70} data={summarize(R.average, 50, toJS(this.candles))} />, node)
    const imageURL = await renderSVG(node.querySelector('svg'))
    const notification = new Notification(this.name, {
      body: `${symbolize((this.percentChange * 100).toFixed(2))}%\n${this.tail('close')}\n${this.exchange.constructor.name}`,
      requireInteraction: false,
      icon: imageURL,
    })
    notification.onshow = () => { setTimeout(() => { notification.close() }, 3000) }
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
