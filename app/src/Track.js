import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Staff from './Staff';
import { 
  changeTrackInstrument,
  deleteTrack,
  toggleMute,
  toggleSharpsMode 
} from './actions';
import { trackData } from './reducers/SongReducer';

export class Track extends Component {
  instrumentChange(e) {
    this.props.changeTrackInstrument(e.target.value, this.props.id);
  }

  render() {
    return (
      <div style={{float: 'left'}}>
        <select value={this.props.trackData.instrument} onChange={this.instrumentChange.bind(this)}>
          <option value='piano'>Piano</option>
          <option value='violin'>Violin</option>
        </select>
        <Button onClick={() => { this.props.toggleSharpsMode(this.props.id); } }>#</Button>
        <Button onClick={() => { this.props.deleteTrack(this.props.id); } }>x</Button>
        <label htmlFor='isMuted'>Mute</label>
        <input id='isMuted' type='checkbox'
            checked={this.props.trackData.isMuted}
            onChange={() => this.props.toggleMute(this.props.id)} />
        <Staff key={this.props.id} id={this.props.id} />
      </div>
    );
  }
}

const mapStateToProps = ({composition, ui}, ownProps) => (
  { trackData: trackData(composition, ownProps.id),
    song: composition.song, 
    ui 
  }
);

const mapDispatchToProps = { 
  changeTrackInstrument,
  deleteTrack,
  toggleMute,
  toggleSharpsMode
};
export default connect(mapStateToProps, mapDispatchToProps)(Track);