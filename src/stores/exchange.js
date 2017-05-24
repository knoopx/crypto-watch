import { types, getParent } from 'mobx-state-tree'

import { Pair } from './pair'
import { getNotificationIconURL } from 'support'
import { symbolize, percentChange } from 'support'

export const Exchange = types.model({
  name: types.identifier(),
  pairs: types.optional(types.map(Pair), {}),

  get appStore() {
    return getParent(this, 2)
  },

  async alert(pair, description) {
    const change = `${percentChange(pair.tail('close', 2), pair.tail('close', 1)).toFixed(2)}%`
    const body = [
      [description, change].join(' '),
      pair.tail('close').toFixed(8),
    ].join('\n')
    this.appStore.notify(`${pair.symbol} - ${pair.exchange.name}`, { body, icon: await getNotificationIconURL(pair) })
  },
}, {
})
