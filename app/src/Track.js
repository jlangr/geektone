import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Staff from './Staff';
import { 
  changeTrackInstrument,
  toggleMute,
  toggleSharpsMode 
} from './actions';

export class Track extends Component {
  instrumentChange(e) {
    this.props.changeTrackInstrument(e.target.value, this.props.id);
  }

  handleInputChange(e) {
    console.log('checkbox event', e);
  }

  render() {
    return (
      <div>
        <select value={this.trackData().instrument} onChange={this.instrumentChange.bind(this)}>
          <option value='piano'>Piano</option>
          <option value='violin'>Violin</option>
        </select>
        <Button onClick={() => { this.props.toggleSharpsMode(this.props.id); } }>#</Button>
        <label htmlFor='isMuted'>Mute</label>
        <input id='isMuted' type='checkbox'
            checked={this.trackData().isMuted}
            onChange={() => this.props.toggleMute(this.props.id)} />
        <Staff key={this.props.id} id={this.props.id} />
      </div>);
  }

  // todo--externalize using selector pattern
  trackData() {
    return this.props.song.tracks[this.props.id];
  }
}

const mapStateToProps = ({composition, ui}) => ({ song: composition.song, ui });
const mapDispatchToProps = { 
  changeTrackInstrument,
  toggleMute,
  toggleSharpsMode
};
export default connect(mapStateToProps, mapDispatchToProps)(Track);