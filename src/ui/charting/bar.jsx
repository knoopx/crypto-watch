import React from 'react'
import { PropTypes } from 'mobx-react'

export default class Bar extends React.PureComponent {
  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    data: PropTypes.arrayOrObservableArray.isRequired,
    x: React.PropTypes.func.isRequired,
    y: React.PropTypes.func.isRequired,
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
