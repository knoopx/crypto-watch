import React from 'react'
import { View, Gutter } from 'kui-layout'
import OpenColor from 'open-color'
import TouchableOpacity from './touchable-opacity'

const styles = {
  default: {
    cursor: 'pointer',
    padding: '4px 16px',
    alignItems: 'center',
    backgroundColor: OpenColor.gray[7],
    borderRadius: '16px',
  },
  active: {
    color: 'white',
    backgroundColor: OpenColor.gray[6],
  },
}

export default class TabButton extends React.PureComponent {
  render() {
    const { children, onClick, active, count } = this.props

    return (
      <TouchableOpacity onClick={onClick} duration={0}>
        <View flow="row" style={{ ...styles.default, ...(active ? styles.active : {}) }}>
          <span style={{ fontWeight: 'bold' }}>{children}</span>
          <Gutter size={8} />
          <span style={{ fontSize: 13 }}>{count}</span>
        </View>
      </TouchableOpacity>
    )
  }
}
