import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'

export default class Blink extends React.PureComponent {
  static defaultProps = {
    duration: 500,
  }

  static propTypes = {
    duration: PropTypes.number.isRequired,
  }

  state = { in: false }

  componentWillUpdate(nextProps) {
    if (!R.equals(this.props.children, nextProps.children)) {
      this.setState({ in: true })
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.setState({ in: false })
      }, this.props.duration)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { style, duration, ...props } = this.props
    return (
      <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: this.state.in ? spring(0) : spring(1) }}>
        {({ opacity }) => <span {...props} style={{ ...style, opacity }} />}
      </Motion>
    )
  }
}
