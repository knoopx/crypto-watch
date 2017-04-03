import React from 'react'
import { inject, observer } from 'mobx-react'

import { View, Gutter } from 'kui-layout'
import Group from 'ui/group'
import TabButton from 'ui/tab-button'

@inject('appStore')
@observer
export default class MarketFilter extends React.PureComponent {
  render() {
    return (
      <Group separator={<Gutter size={8} />}>{this.props.appStore.markets.map(this.renderMarket)}</Group>
    )
  }

  renderMarket = (market) => {
    const { appStore } = this.props
    return (
      <TabButton
        key={market}
        onClick={() => { appStore.toggleMarket(market) }}
        active={appStore.filter.market === market}
        count={appStore.currencyPairs.filter(p => p.base === market).length}
      >
        {market}
      </TabButton>
    )
  }
}
