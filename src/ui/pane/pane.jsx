import React from 'react'
import classNames from 'classnames'

export default class Pane extends React.PureComponent {
  render() {
    const { className, ...props } = this.props
    return (
      <div className={classNames('flex flex-column flex-auto', className)} {...props} />
    )
  }
}
