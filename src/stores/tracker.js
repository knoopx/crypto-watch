import { observable } from 'mobx'

export default class Tracker {
  @observable pending = new Map()

  constructor(delegate) {
    this.delegate = delegate
    this.webSocket = new WebSocket('wss://api-3124.tab-trader.com/v1.0')
    this.webSocket.onopen = this.onOpen
    this.webSocket.onclose = this.onClose
    this.webSocket.onmessage = this.onMessage
    this.webSocket.onerror = this.onError
  }

  onOpen(e) {
    this.delegate.onConnect()
  }

  onClose(e) {
    this.delegate.onDisconnect()
  }

  onMessage(e) {
    if (e.data === 'X') {
      // console.debug('ping')
    } else {
      const data = JSON.parse(e.data)
      if (data.responseId) {
        const resolve = this.pending.get(data.responseId)
        if (resolve) {
          resolve(data)
        } else {
          console.warn(`Unknown responseId ${data.responseId}`)
        }
      } else {
        this.delegate.onEvent(data)
      }
      // console.debug('message', data)
    }
  }

  onError(e) {
    this.delegate.onError(e)
  }

  async subscribe(subscription) {
    this.send({ subscription, eventName: 'subs' })
  }

  async unsubscribe(subscription) {
    this.send({ subscription, eventName: 'unsubs' })
  }

  async request(name, payload = {}) {
    return new Promise((resolve, reject) => {
      const eventName = `${name}_req`
      const responseId = `${eventName}:${this.pending.size + 1}`
      this.pending.set(responseId, resolve)
      this.send({ eventName, responseId, ...payload })
      setTimeout(() => {
        this.pending.delete(responseId)
        reject(new Error(`Timeout waiting for ${responseId}`))
      }, 10000)
    })
  }

  send(payload) {
    // console.info('send', payload)
    this.webSocket.send(JSON.stringify(payload))
  }
}
