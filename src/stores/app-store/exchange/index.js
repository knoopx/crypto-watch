import Axios from 'axios'
import { observable, action, computed, toJS } from 'mobx'
import { Connection } from 'autobahn'

import CurrencyPair from './currency-pair'

export default class Exchange {
  candleSize = 300 // 5 minutes
  backfilling = 86400 // 1 day

  @observable currencyPairMap = new Map()

  connect() {
    const connection = new Connection({ url: 'wss://api.poloniex.com', realm: 'realm1' })
    connection.onopen = (session) => {
      session.subscribe('ticker', this.onTicker)
    }
    connection.open()
  }

  onTicker = ([name, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, dailyHigh, dailyLow]) => {
    this.processTicker(name, {
      last: parseFloat(last),
      lowestAsk: parseFloat(lowestAsk),
      highestBid: parseFloat(highestBid),
      baseVolume: parseFloat(baseVolume),
      quoteVolume: parseFloat(quoteVolume),
    })
  }

  async processTicker(name, ticker) {
    let currencyPair = this.currencyPairMap.get(name)
    if (!currencyPair) {
      currencyPair = new CurrencyPair(this, name)
    }
    currencyPair.update(ticker, this.candleSize)
    this.currencyPairMap.set(name, currencyPair)
  }

  async getHistory(currencyPair) {
    const now = Math.ceil(Date.now() / 1000)
    const response = await Axios.get('https://poloniex.com/public', {
      params: {
        command: 'returnChartData',
        currencyPair: currencyPair.name,
        start: now - this.backfilling,
        end: now,
        period: this.candleSize,
      },
    })

    return response.data.map(d => ({
      high: parseFloat(d.high),
      low: parseFloat(d.low),
      open: parseFloat(d.open),
      close: parseFloat(d.close),
      volume: parseFloat(d.volume),
      date: new Date(d.date * 1000),
    }))
  }
}
