import { observable, computed, action } from 'mobx'
import { Connection } from 'autobahn'

import CurrencyPair from './currency-pair'

class Balance {
  @observable amount

  constructor(exchange, quote, amount = 0) {
    this.quote = quote
    this.amount = amount
  }

  @computed get orders() {
    return this.exchange.orderHistory.filter(order => order.currencyPair.quote === quote)
  }

  // const roi = _.chain(prevOrders).groupBy(o => o.currencyPair.base).map((orders, base) => {
  //   const costBasis = orders.reduce((sum, o) => sum + o.rate, 0) / orders.length
  //   const currencyPair = this.props.appStore.exchange.currencyPairMap.get(`${base}_${quote}`)
  //   if (currencyPair) {
  //     const marketValue = currencyPair.tail.price
  //     return (marketValue - costBasis) / ((marketValue + costBasis) / 2) * 100
  //   }
  //   return 0
  // }).value().reduce((sum, r) => sum + r, 0)
}

export default class Exchange {
  investPercent = 0.1
  maxConcurrentOrders = 4
  fee = 0.25

  @observable currencyPairMap = new Map()
  @observable balances = new Map()
  @observable orders = []
  @observable orderHistory = []

  constructor() {
    this.addBalance('BTC', 1.0)
  }

  connect() {
    const connection = new Connection({ url: 'wss://api.poloniex.com', realm: 'realm1' })
    connection.onopen = (session) => {
      session.subscribe('ticker', this.onTicker)
    }
    connection.open()
  }

  onTicker = ([name, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, dailyHigh, dailyLow]) => {
    const ticker = {
      price: parseFloat(last),
      lowestAsk: parseFloat(lowestAsk),
      highestBid: parseFloat(highestBid),
      baseVolume: parseFloat(baseVolume),
      quoteVolume: parseFloat(quoteVolume),
    }
    this.processTicker(name, ticker)
  }

  upsert(name) {
    let currencyPair = this.currencyPairMap.get(name)
    if (!currencyPair) {
      currencyPair = new CurrencyPair(this, name)
      this.currencyPairMap.set(name, currencyPair)
    }
    return currencyPair
  }

  async processTicker(name, ticker) {
    const currencyPair = this.upsert(name)
    this.processOrders(currencyPair, ticker)
    currencyPair.update(ticker)
  }

  @action addBalance(quote, amount) {
    const balance = this.getBalance(quote)
    balance.amount += amount
  }

  @action getBalance(quote) {
    let balance = this.balances.get(quote)
    if (!balance) {
      balance = new Balance(this, quote)
      this.balances.set(quote, balance)
    }
    return balance
  }

  @action buy(currencyPair, rate, amount) {
    const balance = this.balances.get(currencyPair.base)
    if (balance) {
      this.addBalance(currencyPair.base, -(rate * amount))
      this.orders.push({
        currencyPair,
        rate,
        amount,
        type: 'buy',
      })
    }
  }

  @action sell(currencyPair, rate, amount) {
    const balance = this.balances.get(currencyPair.quote)
    if (balance) {
      this.addBalance(currencyPair.quote, rate * amount)
      this.orders.push({
        currencyPair,
        rate,
        amount,
        type: 'sell',
      })
    }
  }

  processOrders(currencyPair, ticker) {
    this.orders = this.orders.filter((order) => {
      if (order.currencyPair.name === currencyPair.name && order.type === 'buy' && ticker.highestBid >= order.rate) {
        this.addBalance(currencyPair.quote, order.amount)
        this.orderHistory.push(order)
        return false
      }

      if (order.currencyPair.name === currencyPair.name && order.type === 'sell' && ticker.lowestAsk >= order.rate) {
        const balance = this.balances.get(currencyPair.base) || 0
        this.addBalance(currencyPair.base, order.amount)
        this.orderHistory.push(order)
        return false
      }

      return true
    })
  }
}
