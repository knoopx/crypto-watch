import React from 'react'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import OpenColor from 'open-color'
import Color from 'color-js'
import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from 'react-stockcharts'

const { CandlestickSeries, BarSeries, LineSeries, AreaOnlySeries, MACDSeries } = series
const { XAxis, YAxis } = axes
const { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate, EdgeIndicator } = coordinates
const { OHLCTooltip, MovingAverageTooltip, BollingerBandTooltip, StochasticTooltip } = tooltip
const { discontinuousTimeScaleProvider } = scale
const { ema, sma, macd } = indicator
const { fitWidth } = helper

const textColor = OpenColor.gray[6]
const successColor = OpenColor.green[4]
const dangerColor = OpenColor.red[5]

class StockChart extends React.PureComponent {
  xAccessor = d => d.date

  render() {
    const ema20 = ema()
			.id(0)
			.windowSize(20)
      .stroke(OpenColor.blue[5])
			.merge((d, c) => { d.ema20 = c })
			.accessor(d => d.ema20)

    const ema50 = ema()
			.id(2)
      .stroke(OpenColor.blue[5])
			.windowSize(50)
			.merge((d, c) => { d.ema50 = c })
			.accessor(d => d.ema50)

    const smaVolume50 = sma()
			.id(3)
			.windowSize(50)
			.sourcePath('volume')
      .fill(OpenColor.blue[5])
			.merge((d, c) => { d.smaVolume50 = c })
			.accessor(d => d.smaVolume50)

    const macdCalculator = macd()
			.fast(12)
			.slow(26)
			.signal(9)
			.merge((d, c) => { d.macd = c })
			.accessor(d => d.macd)

    return (
      <ChartCanvas
        {...this.props}
        height={300}
        margin={{ left: 20, right: 100, top: 20, bottom: 20 }}
        type={'hybrid'}
        xAccessor={this.xAccessor}
        xScaleProvider={discontinuousTimeScaleProvider}
        calculator={[ema20, ema50, smaVolume50, macdCalculator]}
        panEvent
        zoomEvent={false}
        clamp
      >
        <Chart
          id={1}
          yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
          height={200}
        >
          <MouseCoordinateY
            rectWidth={80}
            at="right"
            orient="right"
            displayFormat={format('.8f')}
          />

          <CandlestickSeries
            opacity={1}
            stroke={'none'}
            wickStroke={d => d.close > d.open ? successColor : dangerColor}
            fill={d => d.close > d.open ? successColor : dangerColor}
          />

          <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} strokeWidth={2} />
          <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} strokeWidth={2} />

          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            tickFormat={format('.8f')}
            stroke={textColor}
            tickStroke={textColor}
          />

          <XAxis
            axisAt="bottom"
            orient="bottom"
            stroke={textColor}
            tickStroke={textColor}
            showTicks={false}
          />

          <EdgeIndicator
            itemType="last" orient="right" edgeAt="right"
            rectWidth={80}
            displayFormat={format('.8f')}
            yAccessor={d => d.close} fill={d => d.close > d.open ? successColor : dangerColor}
          />

          {/* <OHLCTooltip origin={[0, 0]} xDisplayFormat={timeFormat('%Y-%m-%d %H:%M:%S')} fill={textColor} /> */}
        </Chart>

        <Chart
          id={2}
          yExtents={d => d.volume}
          height={50}
          origin={(w, h) => [0, 150]}
        >
          <YAxis axisAt="left" orient="left" ticks={3} stroke={textColor} tickStroke={textColor} />
          <BarSeries
            yAccessor={d => d.volume}
            fill={d => OpenColor.gray[2]}
            opacity={0.1}
            stroke={false}
          />
          <AreaOnlySeries yAccessor={smaVolume50.accessor()} fill={smaVolume50.fill()} opacity={0.5} />
        </Chart>

        <Chart
          id={3}
          height={50}
          origin={(w, h) => [0, 200]}
          padding={{ top: 10, bottom: 10 }}
          yExtents={macdCalculator.accessor()}
        >
          <BarSeries
            fill={macdCalculator.fill().divergence}
            baseAt={(x, y) => y(0)}
            stroke={false}
            opacity={1}
            yAccessor={y => macdCalculator.accessor()(y).divergence}
          />

          <XAxis
            axisAt="bottom"
            orient="bottom"
            stroke={textColor}
            tickStroke={textColor}
          />

          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            stroke={textColor}
            tickStroke={textColor}
            showTicks={false} outerTickSize={0}
          />

          <MouseCoordinateX
            rectWidth={60}
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%H:%M:%S')}
          />
        </Chart>

        <CrossHairCursor stroke={textColor} />
      </ChartCanvas>
    )
  }
}

export default fitWidth(StockChart)
