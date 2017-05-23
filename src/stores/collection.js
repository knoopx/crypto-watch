import { extendObservable, ObservableMap } from 'mobx'

export default class Collection extends ObservableMap {
  constructor(modelClass, keyProp) {
    super()
    this.modelClass = modelClass
    this.keyProp = keyProp
  }

  upsert(props = {}) {
    let obj = this.get(props[this.keyProp])
    if (!obj) {
      const TargetClass = this.modelClass
      obj = new TargetClass()
      this.set(props[this.keyProp], obj)
    }
    extendObservable(obj, props)
    return obj
  }
}
