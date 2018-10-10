import React, { Component } from 'react'
import { Col, Table } from 'react-bootstrap'

class HelpPanel extends Component {
  render() {
    return (
      <div>
        <Col xs={2}>
        <Table responsive>
        <tbody>
          <tr><td>&lt;-</td><td> pre</td></tr>
          <tr><td>-&gt;</td><td> next</td></tr>
        </tbody>
        </Table>
        </Col>
        <Col xs={2}>
        <Table responsive>
        <tbody>
          <tr><td>.</td><td>toggle</td></tr>
          <tr><td>1</td><td>whole</td></tr>
        </tbody>
        </Table>
        </Col>
      </div>)
  }
}

export default HelpPanel

/*U
            <strong>^</strong> up<br />
            <strong>v</strong> down<br />
            <strong>shift&lt;- </strong> prev bar<br />
            <strong>shift-&gt; </strong> next bar<br />
            <strong>^ </strong>up<br />
            <strong>v</strong> down<br />
            <strong>d</strong> dup<br />
            <strong>x</strong> del<br />  

            <strong>2:</strong> half<br />
            <strong>4:</strong> quarter<br />
            <strong>8:</strong> eighth<br />
            <strong>*:</strong> double<br />
            <strong>/:</strong> halve<br />
            <strong>r:</strong> rest<br />
            <strong>y:</strong> redo<br />
            <strong>z:</strong> undo<br />
            */