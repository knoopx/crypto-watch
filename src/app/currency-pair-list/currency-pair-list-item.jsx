import React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import Blink from 'ui/blink'
import ColorIndicator from 'ui/color-indicator'
import Sparkline from 'app/ui/sparkline'
import { symbolize } from 'support'

@observer
export default class CurrencyPairListItem extends React.PureComponent {
  render() {
    const { currencyPair } = this.props
    return (
      <div className="flex flex-auto justify-center items-center pa3 ba b--light-gray" >
        <div className="mr4 tr">
          <div className="b">{currencyPair.quote}</div>
          <div className="silver mb3 f7">{currencyPair.exchange.constructor.name}</div>
          <div className="mb1">{Array.from((currencyPair.tail('close')).toFixed(8)).map((char, i) => <Blink key={i}>{char}</Blink>)} {currencyPair.base}</div>
          <ColorIndicator className="f6" value={currencyPair.percentChange}>
            <Blink>{symbolize((currencyPair.percentChange * 100).toFixed(2))}%</Blink>
          </ColorIndicator>
        </div>
        <div className="w5">
          <Sparkline data={toJS(currencyPair.candles)} width={200} height={100} />
        </div>
      </div>
    )
  }
}
