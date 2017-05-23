import React from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'

@observer
export default class CurrencyPairSelect extends React.PureComponent {
  render() {
    const { pairs, ...props } = this.props
    return (
      <select {...props}>
        {pairs.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
    )
  }
}
