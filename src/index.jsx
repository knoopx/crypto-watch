import React from 'react'
import ReactDOM from 'react-dom'
import { useStrict } from 'mobx'
import { create } from 'mobx-persist'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'

import App from './app'
import { AppStore } from './stores'

const hydrate = create()
// useStrict(true)
const appStore = new AppStore()
hydrate('cryto-watch', appStore)

function render() {
  ReactDOM.render(
    <AppContainer>
      <Provider appStore={appStore}>
        <App />
      </Provider>
    </AppContainer>
    , document.querySelector('#root'),
  )
}

Notification.requestPermission()

if (module.hot) {
  module.hot.accept('./app', render)
}

render()
