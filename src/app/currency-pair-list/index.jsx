import React from 'react'
import { observer } from 'mobx-react'

import CurrencyPairListItem from './currency-pair-list-item'

@observer
export default class CurrencyPairList extends React.PureComponent {
  render() {
    return (
      <div className="flex flex-wrap overflow-y-auto">
        {this.props.pairs.map(this.renderItem)}
      </div>
    )
  }

  renderItem = pair => <CurrencyPairListItem key={pair.symbol} pair={pair} />
}
