import R from 'ramda'
import React from 'react'

export default function Group({ children, ...props }) {
  const forwardProps = ['width', 'height', 'data', 'x', 'y']
  return (
    <g {...R.omit(['data'], props)}>{React.Children.map(children, child => React.cloneElement(child, { ...R.pick(forwardProps, props), ...R.pick(forwardProps, child.props) }))}</g>
  )
}
