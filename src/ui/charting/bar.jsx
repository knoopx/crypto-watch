import React from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'

export default class Bar extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array,
    x: PropTypes.func,
    y: PropTypes.func,
  }

  static defaultProps = {
    shapeRendering: 'crispEdges',
  }

  render() {
    const { width, height, data, x, y, xScale, yScale, fill, ...props } = this.props

    if (!(data.length > 2) || !height || !width) { return null }

    const barWidth = xScale.bandwidth()

    const rects = data.map((d, i) => ({
      x: x(d, i),
      width: barWidth,
      y: Math.min(yScale(0), y(d, i)),
      height: Math.abs(y(d, i) - yScale(0)),
      fill: fill(d, i),
    })).filter(R.pipe(R.props(['x', 'width', 'y', 'height']), R.none(Number.isNaN)))

    return (
      <g>
        {rects.map((rect, i) => (
          <rect
            key={i}
            {...props}
            {...rect}
            shapeRendering="optimizeSpeed"
          />
        ))}
      </g>
    )
  }
}
