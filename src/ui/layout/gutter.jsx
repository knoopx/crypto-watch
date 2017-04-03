import React from 'react'

export default class Gutter extends React.PureComponent {
  static contextTypes = {
    flow: React.PropTypes.string.isRequired,
  }

  static propTypes = {
    size: React.PropTypes.number.isRequired,
  }

  render() {
    const styles = {
      row: { width: this.props.size },
      column: { height: this.props.size },
    }

    return (
      <div style={styles[this.context.flow]} />
    )
  }
}
