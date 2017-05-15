import React from 'react'
import { isEqual } from 'lodash'
import { Motion, spring } from 'react-motion'

export default class Blink extends React.PureComponent {
  state = { hasChanged: false }

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.children, this.props.children)) {
      this.setState({ hasChanged: true })
      this.timeout = setTimeout(() => {
        this.setState({ hasChanged: false })
      }, 500)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { style, ...props } = this.props
    return (
      <Motion style={{ opacity: this.state.hasChanged ? spring(0) : spring(1) }}>
        {({ opacity }) => <span {...props} style={{ ...style, opacity }} />}
      </Motion>
    )
  }
}
