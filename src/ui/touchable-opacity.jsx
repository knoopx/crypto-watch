import React from 'react'
import { Motion, spring } from 'react-motion'

export default class TouchableOpacity extends React.PureComponent {
  static defaultProps = {
    duration: 200,
  }

  state = {
    isMouseDown: false,
  }

  componentWillMount() {
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    window.addEventListener('mouseup', this.onMouseUp)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
    window.removeEventListener('mouseup', this.onMouseUp)
  }

  onMouseDown() {
    this.setState({ isMouseDown: true })
  }

  onMouseUp() {
    this.timeout = setTimeout(() => {
      this.setState({ isMouseDown: false })
    }, this.props.duration)
  }

  render() {
    const { style, duration, children, ...props } = this.props
    const child = React.Children.only(children)
    // {...props} style={} onMouseDown={this.onMouseDown}

    return (
      <Motion defaultStyle={{ opacity: 1 }} style={{ opacity: spring(this.state.isMouseDown ? 0.25 : 1) }}>
        {animatedStyle => React.cloneElement(child, { ...props, style: { ...style, ...animatedStyle }, onMouseDown: this.onMouseDown })}
      </Motion>
    )
  }
}
