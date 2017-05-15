import React from 'react'
import { observer } from 'mobx-react'

import CurrencyPairListItem from './currency-pair-list-item'

@observer
export default class CurrencyPairList extends React.PureComponent {
  render() {
    return (
      <div className="flex flex-wrap overflow-y-auto">
        {this.props.currencyPairs.map(this.renderItem)}
      </div>
    )
  }

  renderItem = currencyPair => <CurrencyPairListItem key={currencyPair.name} currencyPair={currencyPair} />
}
