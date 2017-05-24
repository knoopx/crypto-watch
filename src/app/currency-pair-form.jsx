import React from 'react'
import shortid from 'shortid'
import { observable, computed, toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { WatchListItem } from 'stores/watch-list-item'
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
        <input className="mr2" value={this.watchItem.symbol} onChange={(e) => { this.watchItem.symbol = e.target.value }} />
        <input type="submit" value="Submit" />
      </form>
    )
  }

  @computed get pairs() {
    return this.watchItem.exchange ? this.watchItem.exchange.supportedCurrencyPairs : []
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.appStore.addWatchListItem(toJS(this.watchItem))
    this.watchItem = this.build()
  }

  build() {
    return {
      id: shortid.generate(),
      exchange: '',
      symbol: '',
    }
  }
}
