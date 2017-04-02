import { observable, action, computed, toJS } from 'mobx'

export default class Trader {
  @observable log = []

  constructor(exchange) {
    this.exchange = exchange
  }
}
