import React from 'react'
import ReactDOM from 'react-dom'
import { useStrict } from 'mobx'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'

import App from './app'
import { AppStore } from './stores'
import exchanges from './exchanges'

// useStrict(true)
const appStore = new AppStore(exchanges.map(Exchange => new Exchange()))

window.appStore = appStore

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

if (module.hot) {
  module.hot.accept('./app', render)
}

render()
