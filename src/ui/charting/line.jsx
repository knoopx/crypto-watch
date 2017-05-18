import R from 'ramda'
import React from 'react'
import { line } from 'd3'
import PropTypes from 'prop-types'

export default class Line extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: [],
    fill: 'transparent',
  }


  render() {
    const { data, x, y, ...props } = this.props
    const d = R.pipe(R.addIndex(R.map)((value, i) => [x(value, i), y(value, i)]), R.reject(R.any(Number.isNaN)), line())
    return (
      <g>
        <path {...props} d={d(data)} />
      </g>
    )
  }
}
