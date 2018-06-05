import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import NumericInput from 'react-numeric-input';

import './App.css';

import Track from './Track';
import HelpPanel from './components/HelpPanel';

import * as ToneUtils from './ToneUtils';
import { 
  changeBpm, loadSong, loadSynths, newTrack, saveSong
} from './actions';
import { synthsLoaded } from './reducers/SynthReducer';

export class App extends Component {
  componentDidMount() {
    this.props.loadSynths();
  }

  render() {
    const tracks = this.props.song.tracks.map((track, i) => <Track key={i} id={i} />);
    return (
      <div className="App">
        <p>{this.props.song.name}</p>
        { tracks }
        <Form>
          <label htmlFor='bpm'>BPM</label>
          <NumericInput 
            id='bpm' 
            style={{input: { width: 70 }}} 
            min={25} max={200} 
            value={this.props.song.bpm} 
            onChange={this.props.changeBpm.bind(this)} />
          <Button onClick={() => ToneUtils.play(this.props.song, this.props.synthState.synths)}  
            {...(synthsLoaded(this.props.synthState) ? {} : { disabled : true })}>Play</Button>
          <Button onClick={() => ToneUtils.stop() }>Stop</Button>
          <Button onClick={() => this.props.saveSong(this.props.song) }>Save</Button>
          <Button onClick={this.props.loadSong}>Load</Button>
          <Button onClick={() => this.props.newTrack() }>Add Track</Button>
          <HelpPanel />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    song: state.composition.song,
    synthState: state.samples
  };
};

const mapDispatchToProps = { 
  changeBpm, loadSong, loadSynths, newTrack, saveSong
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
