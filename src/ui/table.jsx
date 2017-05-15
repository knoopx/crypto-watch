import React from 'react'
import classNames from 'classnames'

    // border-spacing: 0;
    // width: 100%;
    // border: 0;
    // border-collapse: separate;

export function Table({ className, ...props }) {
  return (
    <table className={classNames('w-100 b0 collapse', className)} {...props} />
  )
}

export function Row({ className, ...props }) {
  return (
    // bb b--moon-gray
    <tr className={classNames('striped--near-white', className)} {...props} />
  )
}


export function Column({ className, ...props }) {
  return (
    <td className={classNames('pv1 ph2', className)} {...props} />
  )
}
