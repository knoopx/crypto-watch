import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { inject } from 'mobx-react'

export default class Bar extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    fill: PropTypes.func,
  }

  static defaultProps = {
    data: [],
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
