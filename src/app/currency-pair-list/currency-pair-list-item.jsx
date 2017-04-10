import React from 'react'
import OpenColor from 'open-color'
import { inject, observer } from 'mobx-react'
import { View, Gutter, Spacer } from 'ui/layout'
import Blink from 'ui/blink'
import ColorIndicator from 'ui/color-indicator'

import Sparkline from './sparkline'

@inject('appStore')
@observer
export default class CurrencyPairListItem extends React.PureComponent {
  render() {
    const { currencyPair, appStore } = this.props
    const { exchange } = appStore
    const baseBalance = exchange.getBalance(currencyPair.base).amount
    const rate = currencyPair.tail.price
    const amount = (baseBalance * 0.01 / rate)

    return (
      <View flow="row" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: `1px solid ${OpenColor.gray[9]}`, height: 50 }}>
        <View style={{ flex: 1, fontSize: 19, fontWeight: 'bold', width: 160 }}>{currencyPair.quote} ({currencyPair.base})</View>
        <Gutter size={8} />
        <View style={{ flex: 1 }}>{baseBalance > 0 && <button onClick={() => exchange.buy(currencyPair, rate, amount)}>BUY {amount.toFixed(8)} {currencyPair.quote}</button>}</View>
        <Blink style={{ flex: 1, textAlign: 'right' }}>{(currencyPair.tail.price).toFixed(8)}</Blink>
        <Blink style={{ flex: 1, textAlign: 'right' }}><ColorIndicator value={currencyPair.percentChange}>{(currencyPair.percentChange * 100).toFixed(2)}%</ColorIndicator></Blink>
        {/* <Gutter size={8} /> */}
        {/* <div>({(currencyPair.speed.toFixed(2))} t/s)</div> */}
        <Gutter size={20} />
        <View style={{ flex: 8 }}>
          <Sparkline data={currencyPair.history} height={30} />
        </View>
      </View>
    )
  }
}
