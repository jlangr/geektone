import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import './App.css';

import Track from './Track';
import HelpPanel from './components/HelpPanel';

import * as ToneUtils from './ToneUtils';
import { newTrack, loadSong, saveSong, loadSynths } from './actions';
import { synthsLoaded } from './reducers/SynthReducer';

class App extends Component {
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
          <Button onClick={() => ToneUtils.play(this.props.song.tracks, this.props.synthState.synths)}  
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

const mapDispatchToProps = { newTrack, loadSong, saveSong, loadSynths };

export default connect(mapStateToProps, mapDispatchToProps)(App);
