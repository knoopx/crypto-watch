import React from 'react'
import { View } from 'ui/layout'

export default class Pane extends React.PureComponent {
  render() {
    const { style, ...props } = this.props
    return (
      <View flow="column" style={{ flex: 1, ...style }} {...props}>
        {this.props.children}
      </View>
    )
  }
}
