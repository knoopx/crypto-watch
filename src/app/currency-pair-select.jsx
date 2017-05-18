import React from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'

@observer
@inject('appStore')
export default class CurrencyPairSelect extends React.PureComponent {
  render() {
    const { exchange, ...props } = this.props
    const currencyPairs = exchange ? exchange.currencyPairs : []
    return (
      <select {...props}>
        {currencyPairs.map((({ name }) => (
          <option value={name}>{name}</option>
        )))}
      </select>
    )
  }
}
