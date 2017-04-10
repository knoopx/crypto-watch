import React from 'react'
import { findDOMNode } from 'react-dom'

export function fitWidth(Component, minWidth = 100) {
  return class extends React.PureComponent {
    state = {}

    componentDidMount() {
      this.handleWindowResize()
      // window.addEventListener('resize', this.handleWindowResize)
    }

    componentWillUnmount() {
      // window.removeEventListener('resize', this.handleWindowResize)
    }

    handleWindowResize = () => {
      this.setState({ width: Math.max(findDOMNode(this).parentNode.clientWidth, minWidth) })
    }

    render() {
      if (this.state.width) {
        return <Component width={this.state.width} {...this.props} />
      }
      return <noscript />
    }
	}
}
