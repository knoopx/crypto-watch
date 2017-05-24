import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import App from './app'
import { AppStore } from './stores'
import { onSnapshot, connectReduxDevtools } from 'mobx-state-tree'

const appStore = AppStore.create(JSON.parse(localStorage.getItem('state')) || {})
onSnapshot(appStore, ({ filter, muteNotifications, watchList, availableExchanges }) => localStorage.setItem('state', JSON.stringify({ filter, muteNotifications, watchList, availableExchanges })))
connectReduxDevtools(require('remotedev'), appStore)

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
