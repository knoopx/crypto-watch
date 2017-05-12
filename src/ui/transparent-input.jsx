import React from 'react'
import classNames from 'classnames'

export default class TransparentInput extends React.PureComponent {
  static defaultProps = {
    type: 'text',
  }

  render() {
    const { className, onChange, ...props } = this.props
    return (
      <input
        className={classNames('flex flex-auto input-reset', className)}
        style={{ outline: 'none', border: 'none', background: 'none', fontSize: '14px', color: 'inherit', fontSize: 'inherit' }}
        onChange={this.onChange}
        {...props}
      />
    )
  }

  onChange = (e) => {
    this.props.onChange(e.target.value)
  }
}
