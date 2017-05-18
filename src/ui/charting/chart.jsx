import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'mobx-react'

export default class Chart extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }

  render() {
    const { width, height, ...props } = this.props
    return (
      <svg {...{ width, height, ...props }} />
    )
  }
}
