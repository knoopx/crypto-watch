import { observable, computed, action } from 'mobx'
import { Connection } from 'autobahn'

import Exchange from 'exchanges/base'

export default class Poloniex extends Exchange {
  constructor() {
    super()
    const connection = new Connection({ url: 'wss://api.poloniex.com', realm: 'realm1' })
    connection.onopen = (session) => {
      session.subscribe('ticker', this.onTicker)
    }
    connection.open()
  }

  onTicker = ([name, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, dailyHigh, dailyLow]) => {
    const currencyPair = this.upsert(name.replace('_', '/'))
    currencyPair.update(parseFloat(last))
  }
}
