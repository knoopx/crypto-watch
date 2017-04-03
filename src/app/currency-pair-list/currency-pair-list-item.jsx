import React from 'react'
import { inject, observer } from 'mobx-react'
import Chart from './chart'

@inject('appStore')
@observer
export default class CurrencyPairListItem extends React.PureComponent {
  render() {
    const { currencyPair, appStore } = this.props

    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', height: 330 }}>
        <div style={{ display: 'flex', flexDiection: 'row', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>{currencyPair.quote} ({currencyPair.base})</div>
          <div style={{ marginLeft: 8, fontSize: 13 }}>{(currencyPair.percentChange * 100).toFixed(2)}%</div>
        </div>
        <div style={{ flex: 1 }}>
          <Chart seriesName={currencyPair.name} data={currencyPair.candleSticks} />
        </div>
      </div>
    )
  }
}
