import { types } from 'mobx-state-tree'

export const Candle = types.model({
  id: types.identifier(),
})
