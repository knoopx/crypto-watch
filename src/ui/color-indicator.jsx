import PropTypes from 'prop-types';
import React from 'react'
import OpenColor from 'open-color'

export default class ColorIndicator extends React.PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired,
    positiveColor: PropTypes.string.isRequired,
    negativeColor: PropTypes.string.isRequired,
  }

  static defaultProps = {
    positiveColor: OpenColor.green[6],
    negativeColor: OpenColor.red[6],
  }

  render() {
    const { style, value, positiveColor, negativeColor, ...props } = this.props
    return <div {...props} style={{ ...style, color: value === 0 ? 'inherit' : value > 0 ? positiveColor : negativeColor }} />
  }
}
