import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

export default class Chart extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    x: PropTypes.func,
    y: PropTypes.func,
  }

  static defaultProps = {
    data: [],
  }

  render() {
    const { width, height, data, x, y, children, ...props } = this.props
    return (
      <svg {...{ width, height, ...props }}>
        {React.Children.map(children, this.renderChild)}
      </svg>
    )
  }

  renderChild = (child) => {
    const { width, height, data, x, y } = this.props
    const props = { width, height, data, x, y, ...child.props }
    return React.cloneElement(child, props)
  }
}
