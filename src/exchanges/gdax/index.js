import { observable, computed, action } from 'mobx'

import Exchange from 'exchanges/base'

export default class GDAX extends Exchange {
  constructor() {
    super()
    this.subscribe()
  }

  async subscribe() {
    const res = await fetch('https://api.gdax.com/products')
    const data = await res.json()
    this.pairs = data.map(p => p.id)
    this.ws = new WebSocket('wss://ws-feed.gdax.com')
    this.ws.onopen = this.onOpen
    this.ws.onmessage = this.onMessage
  }

  onOpen() {
    this.send({ type: 'subscribe', product_ids: this.pairs })
  }

  send(data) {
    this.ws.send(JSON.stringify(data))
  }

  onMessage(e) {
    const data = JSON.parse(e.data)
    const { type, price, product_id } = data
    if (type === 'match') {
      const currencyPair = this.upsert(product_id.replace('-', '/'))
      currencyPair.update(parseFloat(price))
    }
  }
}
