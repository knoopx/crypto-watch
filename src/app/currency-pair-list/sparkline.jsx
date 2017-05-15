import React from 'react'
import { max, scaleLinear, scaleBand, extent } from 'd3'
import { Chart, Line, Bar } from 'ui/charting'
import OpenColor from 'open-color'

export default class Sparkline extends React.PureComponent {
  static defaultProps = {
    padding: 1,
  }

  render() {
    const { width, height, data, ...props } = this.props

    return (
      <Chart width={width} height={height} data={data} x={this.x} >
        <Bar x={this.xMACD} xScale={this.xMACDScale} y={this.yMACD} yScale={this.yMACDScale} fill={({ macd }) => macd > 0 ? OpenColor.green[3] : OpenColor.red[3]} />
        <Line y={this.y} stroke={OpenColor.gray[6]} />
      </Chart>
    )
  }

  get xScale() {
    const { width, padding, data } = this.props
    return scaleLinear().range([0 + padding, width - padding]).domain(extent(data, (d, i) => i))
  }

  get yScale() {
    const { height, padding, data } = this.props
    const values = data.map(d => d.close)
    return scaleLinear().range([height - padding, 0 + padding]).domain(extent(values))
  }

  get xMACDScale() {
    const { width, padding, data } = this.props
    return scaleBand().range([0 + padding, width - padding]).domain(data.map((d, i) => i))
  }

  get yMACDScale() {
    const { height, padding, data } = this.props
    const yMax = max(data.map(d => Math.abs(d.macd)))
    return scaleLinear().range([height - padding, 0 + padding]).domain([-yMax, yMax]).nice()
  }

  x = (data, i) => this.xScale(i)
  y = data => this.yScale(data.close)
  yEMA20 = data => this.yScale(data.ema20)
  yEMA50 = data => this.yScale(data.ema50)
  yVolume = data => this.yVolumeScale(data.baseVolume)
  xMACD = (data, i) => this.xMACDScale(i)
  yMACD = data => this.yMACDScale(data.macd)
}
