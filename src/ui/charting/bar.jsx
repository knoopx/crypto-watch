import React from 'react'
import PropTypes from 'prop-types'
import { propTypes } from 'mobx-react'

export default class Bar extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: propTypes.arrayOrObservableArray.isRequired,
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }

  static defaultProps = {
    shapeRendering: 'crispEdges',
  }

  render() {
    const { width, height, data, x, y, ...props } = this.props
    const barWidth = width / (data.length - 1)

    if (!width || !height || data.length < 2) {
      return null
    }

    return (
      <g>
        {data.map((d, i) => <rect key={i} {...props} x={x(d, i) - (barWidth / 2)} width={barWidth} y={height - y(d, i)} height={y(d, i)} />)}
      </g>
    )
  }
}
