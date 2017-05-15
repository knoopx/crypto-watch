import React from 'react'
import { line } from 'd3'
import PropTypes from 'prop-types'
import OpenColor from 'open-color'

export default class Line extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    x: PropTypes.func,
    y: PropTypes.func,
  }

  static defaultProps = {
    fill: 'transparent',
  }

  render() {
    const { data, x, y, ...props } = this.props

    const lines = data.map((d, i) => [x(d, i), y(d, i)]).filter(val => val.every(v => !Number.isNaN(v)))
    return (
      <g>
        <path {...props} d={line()(lines)} />
      </g>
    )
  }
}
