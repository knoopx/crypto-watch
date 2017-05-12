import React from 'react'
import { observable, computed } from 'mobx'
import { inject, observer } from 'mobx-react'

// import List from 'ui/virtual-list'

import CurrencyPairListItem from './currency-pair-list-item'

@observer
export default class CurrencyPairList extends React.PureComponent {
  render() {
    // return (
    //   <List items={this.props.currencyPairs} renderItem={this.renderItem} itemHeight={50} />
    // )
    return (
      <div className="overflow-y-auto">{this.props.currencyPairs.map(this.renderItem)}</div>
    )
  }

  renderItem = currencyPair => <CurrencyPairListItem key={currencyPair.name} currencyPair={currencyPair} />
}
