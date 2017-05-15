import React from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Pane, Header, Body, Footer } from 'ui/pane'
import ExchangeSelect from '../exchange-select'

@inject('appStore')
@observer
export default class HoldingForm extends React.PureComponent {
  @observable holding = this.build()

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <label>
          Exchange
          <ExchangeSelect value={this.holding.exchange} onChange={(e) => { this.holding.exchange = e.target.value }} />
        </label>

        <label>
          Base
          <input value={this.holding.base} onChange={(e) => { this.holding.base = e.target.value }} />
        </label>

        <label>
          Quote
          <input value={this.holding.quote} onChange={(e) => { this.holding.quote = e.target.value }} />
        </label>

        <label>
          Amount
          <input type="number" value={this.holding.amount} onChange={(e) => { this.holding.amount = e.target.value }} />
        </label>

        <label>
          Price
          <input type="number" value={this.holding.rate} onChange={(e) => { this.holding.rate = e.target.value }} />
        </label>

        <label>
          Fee
          <input type="number" value={this.holding.fee} onChange={(e) => { this.holding.fee = e.target.value }} />
        </label>

        <input type="submit" value="Submit" />
      </form>
    )
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.appStore.holdings.push(this.holding)
    this.holding = this.build()
  }

  build() {
    return {
      exchange: '',
      base: '',
      quote: '',
      amount: 1,
      prince: '',
      fee: 0.0,
    }
  }
}
