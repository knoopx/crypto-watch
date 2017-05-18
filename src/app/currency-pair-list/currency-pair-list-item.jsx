import R from 'ramda'
import React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import Blink from 'ui/blink'
import ColorIndicator from 'ui/color-indicator'
import Sparkline from 'app/ui/sparkline'
import { percentChange, symbolize } from 'support'

@inject('appStore')
@observer
export default class CurrencyPairListItem extends React.PureComponent {
  render() {
    const { appStore, currencyPair } = this.props

    const matchProps = R.props(['quote', 'base'])
    const holdings = appStore.holdings.filter(R.pipe(matchProps, R.equals(matchProps(currencyPair)))).map(({ amount, rate, fee }) => ({
      amount: parseFloat(amount), rate: parseFloat(rate), fee: parseFloat(fee),
    }))

    const amount = R.sum(R.pluck('amount', holdings))
    const rate = R.mean(R.pluck('rate', holdings))
    const fee = R.sum(R.pluck('fee', holdings))
    const cost = rate + fee

    const revenuePercent = percentChange(amount * cost, amount * currencyPair.tail('close'))
    const revenue = revenuePercent * currencyPair.tail('close')

    return (
      <div className="flex flex-auto justify-center items-center pa3 ba b--light-gray" >
        <div className="mr4 tr">
          <div className="b">{currencyPair.quote}</div>
          <div className="silver mb3 f7">{currencyPair.exchange.constructor.name}</div>
          <div className="mb1">{Array.from((currencyPair.tail('close')).toFixed(8)).map((char, i) => <Blink key={i}>{char}</Blink>)} {currencyPair.base}</div>
          <ColorIndicator className="f6" value={currencyPair.percentChange}>
            <Blink>{symbolize((currencyPair.percentChange * 100).toFixed(2))}%</Blink>
          </ColorIndicator>
          {holdings.length > 0 && (
            <div className="gray f7">
              <Blink>{amount.toFixed(8)}</Blink>
              <ColorIndicator className="f6" value={revenuePercent}>
                <Blink>{symbolize(revenue.toFixed(2))} {currencyPair.base}</Blink> (<Blink>{symbolize((revenuePercent * 100).toFixed(2))}%</Blink>)
              </ColorIndicator>
            </div>
          )}
        </div>
        <div className="w5">
          <Sparkline data={toJS(currencyPair.candles)} width={200} height={100} />
        </div>
      </div>
    )
  }
}
