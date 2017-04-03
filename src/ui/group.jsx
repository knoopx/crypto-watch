import React from 'react'
import { View } from 'kui-layout'

export default class Group extends React.PureComponent {
  render() {
    return <View children={this.renderWithSeparators(this.props.children)} />
  }

  renderWithSeparators = (children) => {
    if (children.length > 1) {
      const items = [children.shift()]
      children.forEach((item, index) => {
        const key = `separator-${item.key || index}`
        const separator = React.cloneElement(this.props.separator, { key })
        items.push(separator, item)
      })
      return items
    }

    return children
  }
}
