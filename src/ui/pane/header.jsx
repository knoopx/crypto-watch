import React from 'react'
import OpenColor from 'open-color'
import Color from 'color-js'

export default class Header extends React.PureComponent {
  static propTypes = {
    children: React.PropTypes.any,
    onClick: React.PropTypes.func,
  }

  render() {
    const style = {
      display: 'flex',
      flexDirection: 'row',
      padding: '8px 16px',
      backgroundColor: Color(OpenColor.gray[8]).darkenByRatio(0.1).toCSS(),
      borderBottom: `1px solid ${OpenColor.gray[9]}`,
      alignItems: 'center',
      height: 40,
    }

    const { onClick } = this.props

    return (
      <div style={style} {...{ onClick }}>
        {this.props.children}
      </div>
    )
  }
}
