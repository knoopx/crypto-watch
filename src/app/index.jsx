import React from 'react'
import { observable, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import OpenColor from 'open-color'

import { View, Divider, Spacer } from 'ui/layout'
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
      <Pane style={{ flex: 8 }}>
        <Header>
          <TransparentInput placeholder={`Filter... (${appStore.filteredCurrencyPairs.length} currencies)`} onChange={appStore.setQuery} />
          <Spacer />
          <div><MarketFilter /></div>
        </Header>
        <CurrencyPairList currencyPairs={appStore.filteredCurrencyPairs} />
      </Pane>
    )
  }
}
