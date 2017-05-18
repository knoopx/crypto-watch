import React from 'react'
import OpenColor from 'open-color'
import { max, scaleLinear, scaleBand } from 'd3'
import { Bar } from 'ui/charting'

export default class MACD extends React.PureComponent {
  static defaultProps = {
    padding: 1,
  }

  render() {
    const { width, height, data, ...props } = this.props
    return (
      <Bar x={this.x} xScale={this.xScale} y={this.y} yScale={this.yScale} fill={this.getFill} />
    )
  }

  x = (data, i) => this.xScale(i)
  y = data => this.yScale(data.macd)

  get xScale() {
    const { width, padding, data } = this.props
    return scaleBand().range([0 + padding, width - padding]).domain(data.map((d, i) => i))
  }

  get yScale() {
    const { height, padding, data } = this.props
    const yMax = max(data.map(d => Math.abs(d.macd)))
    return scaleLinear().range([height - padding, 0 + padding]).domain([-yMax, yMax]).nice()
  }

  getFill({ macd }) {
    return macd > 0 ? OpenColor.green[3] : OpenColor.red[3]
  }
}
