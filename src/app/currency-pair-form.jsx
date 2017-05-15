import React from 'react'
import { observable, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import ExchangeSelect from './exchange-select'

@inject('appStore')
@observer
export default class CurrencyPairForm extends React.PureComponent {
  @observable watchItem = this.build()

  render() {
    const { appStore } = this.props
    return (
      <form onSubmit={this.onSubmit}>
        <ExchangeSelect className="mr2" value={this.watchItem.exchange} onChange={e => this.watchItem.exchange = e.target.value} />
        <input className="mr2" value={this.watchItem.currencyPair} onChange={(e) => { this.watchItem.currencyPair = e.target.value }} />
        <input type="submit" value="Submit" />
      </form>
    )
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.appStore.watchList.push(this.watchItem)
    this.watchItem = this.build()
  }

  build() {
    return {
      exchange: '',
      currencyPair: '',
    }
  }
}
