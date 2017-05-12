import React from 'react'
// import scale from 'linear-scale'
import { scaleLinear, extent } from 'd3'
import { Chart, Line, Bar, fitWidth } from 'ui/charting'
import OpenColor from 'open-color'
import _ from 'lodash'

class Sparkline extends React.PureComponent {
  render() {
    const { width, height, data, ...props } = this.props

    return (
      <Chart width={width} height={height} data={data} x={this.x} >
        {/* <Bar y={this.yVolume} fill={OpenColor.gray[7]} opacity={0.3} /> */}
        <Line y={this.y} stroke={OpenColor.gray[6]} />
        <Line y={this.yEMA20} stroke={OpenColor.yellow[6]} />
        <Line y={this.yEMA50} stroke={OpenColor.blue[6]} />
      </Chart>
    )
  }

  get xScale() {
    const { width, data } = this.props
    return scaleLinear().range([1, width - 1]).domain(extent(data, (d, i) => i))
  }

  get yScale() {
    const { height, data } = this.props
    const values = _.flatten(['price', 'ema20', 'ema50'].map(prop => data.map(d => d[prop])))
    return scaleLinear().range([1, height - 1]).domain(extent(values))
  }

  get yVolumeScale() {
    const { height, data } = this.props
    return scaleLinear().range([1, height - 1]).domain([0, Math.max(...data.map(d => d.baseVolume))])
  }

  x = (data, i) => this.xScale(i)
  y = data => this.yScale(data.price)
  yEMA20 = data => this.yScale(data.ema20)
  yEMA50 = data => this.yScale(data.ema50)
  // yVolume = data => this.yVolumeScale(data.baseVolume)
}

export default fitWidth(Sparkline)
