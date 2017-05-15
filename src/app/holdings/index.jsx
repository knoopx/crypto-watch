import React from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Pane, Header, Body, Footer } from 'ui/pane'
import { Table, Row, Column } from 'ui/table'
import RemoveIcon from 'react-icons/lib/md/delete'

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
              {appStore.holdings.map((holding, i) => (
                <Row key={i}>
                  <Column>{holding.exchange}</Column>
                  <Column>{holding.pair}</Column>
                  <Column>{holding.amount} {holding.quote}</Column>
                  <Column>{holding.rate} {holding.base}</Column>
                  <Column>{holding.fee} {holding.base}</Column>
                  <Column><RemoveIcon className="pointer" size={22} onClick={() => appStore.holdings.remove(holding)} /></Column>
                </Row>
              ))}
            </tbody>
          </Table>
        </Body>
        <Footer>
          <Form />
        </Footer>
      </Pane>
    )
  }
}
