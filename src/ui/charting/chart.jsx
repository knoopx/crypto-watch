import React from 'react'
import { PropTypes } from 'mobx-react'

export default class Chart extends React.PureComponent {
  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    data: PropTypes.arrayOrObservableArray.isRequired,
    x: React.PropTypes.func,
    y: React.PropTypes.func,
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
