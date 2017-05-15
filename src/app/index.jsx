import React from 'react'
import { inject, observer } from 'mobx-react'

import Notifications from 'react-icons/lib/md/notifications'
import NotificationsOff from 'react-icons/lib/md/notifications-off'

import { Pane, Header, Body, Footer } from 'ui/pane'
import TransparentInput from 'ui/transparent-input'
import CurrencyPairList from './currency-pair-list'
import MarketFilter from './market-filter'
import CurrencyPairForm from './currency-pair-form'
import Holdings from './holdings'

@inject('appStore')
@observer
export default class App extends React.PureComponent {
  render() {
    const { appStore } = this.props
    const NotificationIcon = appStore.muteNotifications ? NotificationsOff : Notifications

    return (
      <div className="flex flex-column flex-auto">
        <Pane className="bb b--moon-gray" style={{ flex: 8 }}>
          <Header>
            <TransparentInput className="pa2" placeholder={`${appStore.filteredCurrencyPairs.length} currencies`} onChange={appStore.setQuery} />
            <NotificationIcon className="black" size={24} onClick={() => { appStore.muteNotifications = !appStore.muteNotifications }} />
          </Header>
          <Header>
            <MarketFilter />
          </Header>
          <Body>
            <CurrencyPairList currencyPairs={appStore.filteredCurrencyPairs} />
          </Body>
          <Footer>
            <CurrencyPairForm />
          </Footer>
        </Pane>
        <Holdings />
      </div>
    )
  }
}
