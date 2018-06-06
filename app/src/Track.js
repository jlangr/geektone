import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Staff from './Staff';
import { changeTrackInstrument, toggleSharpsMode } from './actions';

export class Track extends Component {
  instrumentChange(e) {
    this.props.changeTrackInstrument(e.target.value, this.props.id);
  }

  render() {
    return (
      <div>
        <select value={this.trackData().instrument} onChange={this.instrumentChange.bind(this)}>
          <option value='piano'>Piano</option>
          <option value='violin'>Violin</option>
        </select>
        <Button onClick={() => { this.props.toggleSharpsMode(this.props.id); } }>Add #</Button>
        <Staff key={this.props.id} id={this.props.id} tabIndex={this.props.id} />
      </div>);
  }
  // TODO does the Staff component need all three things with the same ID

  trackData() {
    return this.props.song.tracks[this.props.id];
  }
}

const mapStateToProps = ({composition, ui}) => ({ song: composition.song, ui });
const mapDispatchToProps = { changeTrackInstrument, toggleSharpsMode };
export default connect(mapStateToProps, mapDispatchToProps)(Track);