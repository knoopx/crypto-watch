import React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

@observer
export default class App extends React.Component {
  @observable count = 0

  componentWillMount() {
    setInterval(() => {
      this.count++
    }, 1000)
  }

  render() {
    return <div>Hello World ({this.count})</div>
  }
}
