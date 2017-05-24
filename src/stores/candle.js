import { types } from 'mobx-state-tree'

export const Candle = types.model({
  minTime: types.identifier(),
  high: types.number,
  low: types.number,
  open: types.number,
  close: types.number,
  volume: types.number,
})
