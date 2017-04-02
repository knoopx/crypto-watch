import React from 'react'
import ReactDOM from 'react-dom'
import { useStrict } from 'mobx'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import App from './App'

function render() {
  ReactDOM.render(
    <AppContainer>
      <Provider>
        <App />
      </Provider>
    </AppContainer>
    , document.querySelector('#root'),
  )
}

if (module.hot) {
  module.hot.accept('./App', render)
}

render()
