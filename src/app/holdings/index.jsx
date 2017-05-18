import R from 'ramda'
import React from 'react'
import { inject, observer } from 'mobx-react'
import { Pane, Header, Body, Footer } from 'ui/pane'
import { Table, Row, Column } from 'ui/table'
import RemoveIcon from 'react-icons/lib/md/delete'
import ExchangeSelect from '../exchange-select'
import Blink from 'ui/blink'
import ColorIndicator from 'ui/color-indicator'
import { percentChange, symbolize } from 'support'

import Form from './form'

@inject('appStore')
@observer
export default class Holdings extends React.PureComponent {
  render() {
    const { appStore } = this.props
    return (
      <Pane className="bb b--moon-gray" style={{ flex: 8 }}>
        <Header>Holdings</Header>
        <Body>
          <Table>
            <tbody>
              {appStore.holdings.map(this.renderHolding)}
            </tbody>
          </Table>
        </Body>
        <Footer>
          <Form />
        </Footer>
      </Pane>
    )
  }

  renderHolding(holding, i) {
    const { appStore } = this.props

    const matchProps = R.props(['quote', 'base'])
    const currencyPair = appStore.currencyPairs.find(R.pipe(matchProps, R.equals(matchProps(holding))))
    const amount = parseFloat(holding.amount)
    const rate = parseFloat(holding.rate)
    const fee = parseFloat(holding.fee)
    const cost = rate + fee
    const revenuePercent = percentChange(cost, currencyPair.tail('close'))
    const revenue = amount * cost * revenuePercent / 100

    return (
      <Row key={i}>
        <Column><ExchangeSelect value={holding.exchange} onChange={(e) => { holding.exchange = e.target.value }} /></Column>
        <Column>{holding.pair}</Column>
        <Column><input value={holding.amount} onChange={(e) => { holding.amount = e.target.value }} /> {holding.quote}</Column>
        <Column><input value={holding.rate} onChange={(e) => { holding.rate = e.target.value }} /> {holding.base}</Column>
        <Column><input value={holding.fee} onChange={(e) => { holding.fee = e.target.value }} /> {holding.base}</Column>
        <Column>
          <ColorIndicator className="f6" value={revenue}>
            <Blink>{amount.toFixed(8)}</Blink>
            <ColorIndicator className="f6" value={revenuePercent}>
              <Blink>{symbolize(revenue.toFixed(8))} {currencyPair.quote}</Blink> (<Blink>{symbolize((revenuePercent * 100).toFixed(2))}%</Blink>)
            </ColorIndicator>
          </ColorIndicator>
        </Column>

        <Column><RemoveIcon className="pointer" size={22} onClick={() => appStore.holdings.remove(holding)} /></Column>
      </Row>
    )
  }
}
