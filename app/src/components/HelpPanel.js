import React, { Component } from 'react'
import { Button, Col, Table } from 'react-bootstrap'

class HelpPanel extends Component {
  constructor() {
    super()
    this.state = {
      show: true
    }
  }

  render() {
    return (
      <div>
        <Col xs={12}>
          <Button className='btn-song'
            onClick={() => this.setState({show: !this.state.show})}
          >Keyboard Shortcuts</Button>
        </Col>
        <div className={this.state.show ? '' : 'hidden' }>
          <Col xs={4}>
            <Table responsive>
              <tbody>
                <tr><td><strong>&#8592;</strong></td><td>prev note</td></tr>
                <tr><td><strong>&#8594;</strong></td><td>next note</td></tr>
                <tr><td><strong>&#8593;</strong></td><td>up</td></tr>
                <tr><td><strong>&#8595;</strong></td><td>down</td></tr>
                <tr><td><strong>&#8592;</strong></td><td>prev bar</td></tr>
                <tr><td><strong>&#8594;</strong></td><td>next bar</td></tr>
              </tbody>
            </Table>
          </Col>
          <Col xs={4}>
            <Table responsive>
              <tbody>
                <tr><td><strong>1</strong></td><td>whole</td></tr>
                <tr><td><strong>2</strong></td><td>half</td></tr>
                <tr><td><strong>4</strong></td><td>quarter</td></tr>
                <tr><td><strong>8</strong></td><td>eighth</td></tr>
                <tr><td><strong>*</strong></td><td>double</td></tr>
                <tr><td><strong>/</strong></td><td>halve</td></tr>
              </tbody>
            </Table>
          </Col>
          <Col xs={4}>
            <Table responsive>
              <tbody>
                <tr><td><strong>.</strong></td><td>toggle dot</td></tr>
                <tr><td><strong>d</strong></td><td>duplicate</td></tr>
                <tr><td><strong>x</strong></td><td>delete</td></tr>
                <tr><td><strong>r</strong></td><td>toggle rest</td></tr>
                <tr><td><strong>y</strong></td><td>redo</td></tr>
                <tr><td><strong>z</strong></td><td>undo</td></tr>
              </tbody>
            </Table>
          </Col>
        </div>
      </div>)
  }
}

export default HelpPanel