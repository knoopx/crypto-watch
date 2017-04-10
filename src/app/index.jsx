import React from 'react'
import { observable, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import OpenColor from 'open-color'
import _ from 'lodash'
import { percentChange } from 'support'

import Blink from 'ui/blink'
import ColorIndicator from 'ui/color-indicator'
import { View, Divider, Spacer } from 'ui/layout'
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
      <View flow="row" style={{ flex: 1 }}>
        <Pane style={{ flex: 8 }}>
          <Header>
            <TransparentInput placeholder={`Filter... (${appStore.filteredCurrencyPairs.length} currencies)`} onChange={appStore.setQuery} />
            <Spacer />
            <div><MarketFilter /></div>
          </Header>
          <CurrencyPairList currencyPairs={appStore.filteredCurrencyPairs} />
        </Pane>
        <Divider color={OpenColor.gray[9]} size={1} />
        <View flow="column" style={{ flex: 4 }}>
          <Pane>
            <Header>Balances</Header>
            <Body>
              {Array.from(appStore.exchange.balances).map(this.renderBalance)}
            </Body>
          </Pane>
          <Pane>
            <Header>Orders</Header>
            <Body>
              {appStore.exchange.orders.map((order, index) =>
                <View key={index} style={{ padding: 8, borderBottom: `1px solid ${OpenColor.gray[9]}` }}>
                  <div>{order.type}</div>
                  <Spacer />
                  <div>{order.currencyPair.name}</div>
                  <Spacer />
                  <div>{order.rate.toFixed(8)}</div>
                  <Spacer />
                  <div>{order.amount.toFixed(8)}</div>
                </View>,
              )}
            </Body>
          </Pane>
        </View>
      </View>
    )
  }

  renderBalance = ([quote, balance]) => {
    const prevOrders = this.props.appStore.exchange.orderHistory.filter(order => order.currencyPair.quote === quote)
    const roi = _.chain(prevOrders).groupBy(o => o.currencyPair.base).map((orders, base) => {
      const costBasis = orders.reduce((sum, o) => sum + o.rate, 0) / orders.length
      const currencyPair = this.props.appStore.exchange.currencyPairMap.get(`${base}_${quote}`)
      if (currencyPair) {
        const marketValue = currencyPair.tail.price
        return percentChange(costBasis, marketValue)
      }
      return 0
    }).value().reduce((sum, r) => sum + r, 0)

    return (
      <View key={quote} style={{ padding: 8, borderBottom: `1px solid ${OpenColor.gray[9]}` }}>
        <div>{quote}</div>
        <Spacer />
        <div>{(balance.amount * 100).toFixed(8)}</div>
        <Spacer />
        <Blink><ColorIndicator value={roi}>{roi.toFixed(2)}%</ColorIndicator></Blink>
      </View>
    )
  }
}
