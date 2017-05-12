import React from 'react'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import TabButton from 'ui/tab-button'

@inject('appStore')
@observer
export default class MarketFilter extends React.PureComponent {
  render() {
    const { className, appStore, ...props } = this.props
    return <div className={classNames('flex overflow-x-auto', className)}>{appStore.markets.map(this.renderMarket)}</div>
  }

  renderMarket = (market, i) => {
    const { appStore } = this.props
    return (
      <TabButton
        key={market}
        className={classNames({ mr1: i !== appStore.markets.length - 1 })}
        onClick={() => { appStore.toggleMarket(market) }}
        active={appStore.filter.market === market}
        count={appStore.currencyPairs.filter(p => p.base === market).length}
      >
        {market}
      </TabButton>
    )
  }
}
