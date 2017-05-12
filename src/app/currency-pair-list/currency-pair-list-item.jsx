import React from 'react'
import { inject, observer } from 'mobx-react'
import Blink from 'ui/blink'
import ColorIndicator from 'ui/color-indicator'
import Sparkline from './sparkline'
import { symbolize } from 'support'

@inject('appStore')
@observer
export default class CurrencyPairListItem extends React.PureComponent {
  render() {
    const { currencyPair, appStore } = this.props
    const { exchange } = appStore
    const rate = currencyPair.tail.price

    return (
      <div className="flex items-center pa3 bb b--light-gray" >
        <div className="mr4 silver" style={{ width: '4rem' }}>{currencyPair.exchange.constructor.name}</div>
        <div className="mr4 b tr" style={{ width: '3rem' }}>{currencyPair.base}</div>
        <div className="mr2 tr" style={{ width: '8rem' }}>{Array.from((currencyPair.tail.price).toFixed(8)).map((char, i) => <Blink key={i}>{char}</Blink>)}</div>
        <div className="mr4" style={{ width: '3rem' }}>{currencyPair.quote}</div>
        <ColorIndicator className="mr4 tr f6" style={{ width: '3rem' }} value={currencyPair.percentChange}>
          <Blink>{symbolize((currencyPair.percentChange * 100).toFixed(2))}%</Blink>
        </ColorIndicator>
        <div className="flex-auto">
          <Sparkline data={currencyPair.history} height={30} />
        </div>
      </div>
    )
  }
}
