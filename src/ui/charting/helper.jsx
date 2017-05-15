import React from 'react'
import { findDOMNode } from 'react-dom'

export function fitWidth(Component, minWidth = 100) {
  return class extends React.PureComponent {
    state = {}

    componentDidMount() {
      this.onWindowResize()
      window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.onWindowResize)
    }

    onWindowResize() {
      const { parentNode } = findDOMNode(this)
      const parentWidth = parentNode ? parentNode.clientWidth : 0
      this.setState({ width: Math.max(parentWidth, minWidth) })
    }

    render() {
      if (this.state.width) {
        return <Component width={this.state.width} {...this.props} />
      }
      return null
    }
	}
}
