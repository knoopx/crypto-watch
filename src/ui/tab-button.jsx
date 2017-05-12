import React from 'react'
import classNames from 'classnames'
import TouchableOpacity from './touchable-opacity'

const styles = {
  default: 'inline-flex pointer pv2 ph3 items-center justify-center br-pill white',
  inactive: 'bg-moon-gray',
  active: 'bg-gray',
}

export default class TabButton extends React.PureComponent {
  render() {
    const { onClick, active, count, className, children } = this.props

    return (
      <TouchableOpacity onClick={onClick} duration={0}>
        <div className={classNames(styles.default, { [styles.active]: active, [styles.inactive]: !active }, className)}>
          <span className="b mr2">{children}</span>
          <span className="f7">{count}</span>
        </div>
      </TouchableOpacity>
    )
  }
}
