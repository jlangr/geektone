import React, { Component } from 'react';

class HelpPanel extends Component{
  render() {
    return (
      <div>
        &lt;- prev  -&gt; next  ^ up  v down<br />
        shift&lt;- prev bar  shift-&gt; next bar  ^ up  v down<br />
        d dup  x del  . toggle<br />
        1: whole 2: half 4: quarter 8: eighth *: double /: halve<br />
        r: rest<br />
        y: redo z: undo<br />
      </div>);
  }
}

export default HelpPanel;