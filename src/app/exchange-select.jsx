import React from 'react'
import { inject, observer } from 'mobx-react'

@inject('appStore')
@observer
export default class ExchangeSelect extends React.PureComponent {
  render() {
    const { appStore, ...props } = this.props
    return (
      <select {...props}>
        <option value="" />
        {appStore.availableExchanges.map(exchange => <option key={exchange} value={exchange}>{exchange}</option>)}
      </select>
    )
  }
}
