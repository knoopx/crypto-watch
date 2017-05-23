import { observable } from 'mobx'
import Collection from './collection'
import Pair from './pair'
import { getNotificationIconURL } from 'support'
import { symbolize, percentChange } from 'support'

export default class Exchange {
  @observable pairs = new Collection(Pair, 'symbol')

  async alert(pair, description) {
    const change = `${percentChange(pair.tail('close', 2), pair.tail('close', 1)).toFixed(2)}%`
    const body = [
      [description, change].join(' '),
      pair.tail('close').toFixed(8),
    ].join('\n')
    this.appStore.notify(`${pair.symbol} - ${pair.exchange.name}`, { body, icon: await getNotificationIconURL(pair) })
  }
}
