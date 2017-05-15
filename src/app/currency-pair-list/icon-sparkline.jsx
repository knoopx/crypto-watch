import React from 'react'
import OpenColor from 'open-color'
import { scaleLinear, extent } from 'd3'
import { Chart, Line, ReferenceLine, Bar, fitWidth } from 'ui/charting'

export default class IconSparkline extends React.PureComponent {
  render() {
    const { width, height, data, ...props } = this.props

    return (
      <Chart
        width={width} height={height} data={data} x={this.x}
      >
        <Line y={this.y} strokeWidth={0.5} stroke={OpenColor.gray[7]} />
      </Chart>
    )
  }

  get xScale() {
    const { width, data } = this.props
    return scaleLinear().range([1, width - 1]).domain(extent(data, (d, i) => i))
  }

  get yScale() {
    const { height, data } = this.props
    const values = data.map(d => d.close)
    return scaleLinear().range([height - 1, 1]).domain(extent(values))
  }

  x = (data, i) => this.xScale(i)
  y = data => this.yScale(data.close)
}
