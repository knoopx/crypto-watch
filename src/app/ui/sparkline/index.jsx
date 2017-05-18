import React from 'react'
import { Chart } from 'ui/charting'

import CloseLine from './close-line'
import MACD from './macd'

export default class Sparkline extends React.PureComponent {
  static defaultProps = {
    padding: 1,
  }

  render() {
    const { width, height, data, ...props } = this.props

    return (
      <Chart width={width} height={height} data={data} x={this.x} >
        <MACD width={width} height={height} data={data} />
        <CloseLine width={width} height={height} data={data} />
      </Chart>
    )
  }
}
