import React from 'react'
import { observable, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import OpenColor from 'open-color'

import { View, Divider, Spacer } from 'kui-layout'
import { Pane, Header } from 'ui/pane'
import TransparentInput from 'ui/transparent-input'
import CurrencyPairList from './currency-pair-list'
import MarketFilter from './market-filter'

@inject('appStore')
@observer
export default class App extends React.PureComponent {
  render() {
    const { appStore } = this.props
    return (
      <View flow="row" style={{ flex: 1 }}>
        <Pane style={{ flex: 8 }}>
          <Header>
            <TransparentInput placeholder={`Currency Pairs (${appStore.filteredCurrencyPairs.length})`} onChange={appStore.setQuery} />
            <Spacer />
            <div><MarketFilter /></div>
          </Header>
          <CurrencyPairList currencyPairs={appStore.filteredCurrencyPairs} />
        </Pane>
        <Divider />
        <View flow="column" style={{ flex: 4 }}>
          <Pane>
            <Header>Balances</Header>
            {appStore.balances.map(this.renderBalance)}
          </Pane>
          <Divider size={1} color={OpenColor.gray[9]} />
          <Pane>
            <Header>Orders</Header>
          </Pane>
        </View>
      </View>
    )
  }

  renderBalance = balance => (
    <View key={balance.quote} flow="row">
      <View>{balance.quote}</View>
      <View>{balance.amount}</View>
    </View>
  )
}
