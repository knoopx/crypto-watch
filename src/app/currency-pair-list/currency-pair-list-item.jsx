import React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import Blink from 'ui/blink'
import ColorIndicator from 'ui/color-indicator'
import Sparkline from 'app/ui/sparkline'
import { symbolize } from 'support'
import RemoveIcon from 'react-icons/lib/md/delete'

@inject('appStore')
@observer
export default class CurrencyPairListItem extends React.PureComponent {
  render() {
    const { appStore, pair } = this.props
    const change = pair.percentChange('close', 2)
    const changeAll = pair.percentChange('close', pair.candles.size)

    return (
      <div className="flex flex-auto justify-center items-center pa3 ba b--light-gray" >
        <div className="mr4 tr">
          <div className="b">{pair.symbol}</div>
          <div className="silver mb3 f7">{pair.exchange.name}</div>
          <div className="mb1">{Array.from((pair.tail('close')).toFixed(8)).map((char, i) => <Blink key={i}>{char}</Blink>)}</div>
          <ColorIndicator className="f6" value={change}>
            <Blink>{symbolize((change * 100).toFixed(2))}%</Blink>
          </ColorIndicator>
          <ColorIndicator className="f6" value={changeAll}>
            <Blink>{symbolize((changeAll * 100).toFixed(2))}%</Blink>
          </ColorIndicator>
          {pair.holdings.length > 0 && (
            <div className="gray f7">
              <Blink>{pair.amount.toFixed(8)}</Blink>
              <ColorIndicator className="f6" value={pair.revenuePercent}>
                <Blink>{symbolize(pair.revenue.toFixed(2))} {pair.base}</Blink> (<Blink>{symbolize((pair.revenuePercent * 100).toFixed(2))}%</Blink>)
              </ColorIndicator>
            </div>
          )}
        </div>
        <div className="w5">
          <Sparkline data={toJS(pair.candles.values())} width={200} height={100} />
        </div>
        <div><RemoveIcon className="pointer" size={22} onClick={() => appStore.removeFromWatchList(pair)} /></div>
      </div>
    )
  }
}
