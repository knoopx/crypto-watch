import React from 'react'
import { observable, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import ExchangeSelect from './exchange-select'
import CurrencyPairSelect from './currency-pair-select'

@inject('appStore')
@observer
export default class CurrencyPairForm extends React.PureComponent {
  @observable watchItem = this.build()

  render() {
    const { appStore } = this.props

    return (
      <form onSubmit={this.onSubmit}>
        <ExchangeSelect className="mr2" value={this.watchItem.exchange} onChange={(e) => { this.watchItem.exchange = e.target.value }} />
        <CurrencyPairSelect className="mr2" pairs={this.pairs} value={this.pair} onChange={(e) => { this.watchItem.pair = e.target.value }} />
        <input type="submit" value="Submit" />
      </form>
    )
  }

  @computed get exchange() {
    return this.props.appStore.getExchange(this.watchItem.exchange)
  }

  @computed get pairs() {
    return this.exchange ? this.exchange.supportedCurrencyPairs : []
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.appStore.watchList.push(this.watchItem)
    this.watchItem = this.build()
  }

  build() {
    return {
      exchange: '',
      pair: '',
    }
  }
}
