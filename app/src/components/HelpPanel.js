import React, { Component } from 'react';

class HelpPanel extends Component{
  render() {
    return (
      <div>
        <strong>&lt;-</strong> pre<br />
        <strong>-&gt;</strong> next<br />
        <strong>^</strong> up  <br />
        <strong>v</strong> down<br />
        <strong>shift&lt;- </strong> prev bar <br />
        <strong>shift-&gt; </strong> next bar <br />
        <strong>^ </strong>up <br />
        <strong>v</strong> down<br />
        <strong>d</strong> dup<br />
        <strong>x</strong> del<br />  
        <strong>.</strong> toggle<br />
        <strong>1:</strong> whole <br />
        <strong>2:</strong> half <br />
        <strong>4:</strong> quarter <br />
        <strong>8:</strong> eighth <br />
        <strong>*:</strong> double<br />
        <strong>/:</strong> halve<br />
        <strong>r:</strong> rest<br />
        <strong>y:</strong> redo<br />
        <strong>z:</strong> undo<br />
      </div>);
  }
}

export default HelpPanel;