import React from 'react'

export default class TransparentInput extends React.PureComponent {
  static defaultProps = {
    type: 'text',
  }

  render() {
    const { onChange, ...props } = this.props
    return (
      <input style={{ flex: 1, outline: 'none', border: 'none', background: 'none', fontSize: '14px', color: 'inherit', fontSize: 'inherit' }} onChange={this.onChange} {...props} />
    )
  }

  onChange = (e) => {
    this.props.onChange(e.target.value)
  }
}
