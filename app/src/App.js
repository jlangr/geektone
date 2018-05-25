import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Track from './Track';
import * as ToneUtils from './utils/ToneUtils';
import * as actions from './actions';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.loadSamples();
  }

  render() {
    const tracks = this.props.song.tracks.map((track, i) => <Track key={i} id={i} />);
    return (
      <div className="App">
        <p>{this.props.song.name}</p>
        { tracks }
        <Form>
          <Button onClick={() => ToneUtils.play(this.props.song.tracks, this.props.synths)}  {...(this.samplesLoaded() ? {} : { disabled : true })}>Play</Button>
          <Button onClick={() => ToneUtils.stop() }>Stop</Button>
          <Button onClick={() => this.props.saveSong(this.props.song) }>Save</Button>
          <Button onClick={this.props.loadSong}>Load</Button>
          <Button onClick={() => this.props.newTrack() }>Add Track</Button>
          <p>left/right arrows: select prev / next note <br />
          up/down arrows:  move selected note up / down <br />
          d     duplicate <br />
          x     delete <br />
          1: whole 2: half 3: dotted half 4: quarter 8: eighth *: double length /: halve length <br />
          </p>
        </Form>
      </div>
    );
  }

  // TODO what's the best way to get this out
  samplesLoaded() {
    return this.props.synths.length === this.props.expectedSynthCount;
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    song: state.composition.song,
    synths: state.samples.synths,
    expectedSynthCount: state.samples.expectedSynthCount
  };
};

const mapDispatchToProps = dispatch => {
  return {
    newTrack: () => dispatch(actions.newTrack()),
    loadSong: () => dispatch(actions.loadSong()),
    saveSong: song => dispatch(actions.saveSong(song)),
    loadSamples: () => dispatch(actions.loadSamples())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
