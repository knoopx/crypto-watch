import React from 'react'
import OpenColor from 'open-color'
import { scaleLinear, extent } from 'd3'
import { Line } from 'ui/charting'

export default class CloseLine extends React.PureComponent {
  static defaultProps = {
    padding: 1,
  }

  render() {
    const { width, height, data, ...props } = this.props

    return (
      <Line y={this.y} stroke={OpenColor.gray[6]} />
    )
  }

  x = (data, i) => this.xScale(i)
  y = data => this.yScale(data.close)

  get xScale() {
    const { width, padding, data } = this.props
    return scaleLinear().range([0 + padding, width - padding]).domain(extent(data, (d, i) => i))
  }

  get yScale() {
    const { height, padding, data } = this.props
    const values = data.map(d => d.close)
    return scaleLinear().range([height - padding, 0 + padding]).domain(extent(values))
  }
}
