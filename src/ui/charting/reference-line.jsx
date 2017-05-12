import PropTypes from 'prop-types';
import React from 'react'
import { line } from 'd3'

export default class ReferenceLine extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number,
    y: PropTypes.number.isRequired,
    yScale: PropTypes.func
  }

  render() {
    const { width, y, yScale, ...extraProps } = this.props
    const yVal = yScale(y)
    const points = [[0, yVal], [width, yVal]]
    return (
      <path strokeWidth={1} stroke="#549be4" shapeRendering="crispEdges" {...extraProps} d={line()(points)} />
    )
  }
}
