import React from 'react'
import classNames from 'classnames'

export default class Header extends React.PureComponent {
  render() {
    const { className, ...props } = this.props

    return (
      <div className={classNames('flex pa2 bt b--moon-gray items-center', className)} {...props} />
    )
  }
}
