
import React from 'react'
import { observable, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import OpenColor from 'open-color'
import _ from 'lodash'
import { percentChange } from 'support'

import Blink from 'ui/blink'
import ColorIndicator from 'ui/color-indicator'
import { Pane, Header, Body } from 'ui/pane'
import TransparentInput from 'ui/transparent-input'
import CurrencyPairList from './currency-pair-list'
import MarketFilter from './market-filter'

@inject('appStore')
@observer
export default class App extends React.PureComponent {
  render() {
    const { appStore } = this.props
    return (
      <div className="flex flex-column flex-auto">
        <Header>
          <TransparentInput className="pa2" placeholder={`${appStore.filteredCurrencyPairs.length} currencies`} onChange={appStore.setQuery} />
          <MarketFilter className="flex-auto justify-end-ns pl2 bl b--moon-gray" />
        </Header>
        <Pane className="bb b--moon-gray" style={{ flex: 8 }}>
          <CurrencyPairList currencyPairs={appStore.filteredCurrencyPairs} />
        </Pane>
      </div>
    )
  }
}
