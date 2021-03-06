import R from 'ramda'
import React from 'react'
import { Chart } from 'ui/charting'
import { render } from 'react-dom'
import CloseLine from 'app/ui/sparkline/close-line'

export function percentChange(before, after) {
  return (after - before) / ((after + before) / 2)
}

export function symbolize(value) {
  if (value > 0) {
    return `+${value}`
  }

  return value
}

export async function renderSVG(node) {
  return new Promise((resolve, reject) => {
    const svg = new XMLSerializer().serializeToString(node)
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const image = new Image()
    image.src = URL.createObjectURL(blob)

    image.onload = () => {
      URL.revokeObjectURL(image.src)
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    image.onerror = () => {
      URL.revokeObjectURL(image.src)
      reject()
    }
  })
}

export const summarize = R.curry((fn, sliceSize, table) => R.pipe(
  R.pipe(R.addIndex(R.groupBy)((_, i) => i % sliceSize), R.values),
  R.map(rowGroup => R.reduce(
    R.mergeWith(R.max),
    rowGroup[0],
    rowGroup,
   )),
)(table))

export async function getNotificationIconURL(pair, iconSize = 70) {
  const node = document.createElement('div')
  render(
    <Chart width={iconSize} height={iconSize}>
      <CloseLine width={iconSize} height={iconSize} data={pair.candles.values()} />
    </Chart>
  , node)
  return renderSVG(node.querySelector('svg'))
}
