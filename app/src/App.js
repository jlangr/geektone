import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Track from './Track';
import Tone from 'tone';
import Note from './Note';
import NoteSequence from './NoteSequence';
import * as timeUtil from './TimeUtil';
import * as actions from './actions';
import './App.css';

import axios from 'axios';

const axiosClient = axios.create({ baseURL: 'http://localhost:3001', timeout: 4000});

class App extends Component {
  trackCount() {
    return this.props.song.tracks.length;
  }

  render() {
    console.log('rendering; props= ', this.props);
    let canvasCount = 0;
    const tracks = this.props.song.tracks.map(track => {
        return <Track id={canvasCount++} />;
      });
    return (
      <div className="App">
        <p>{this.props.song.name}</p>
        { tracks }
        <Form>
          <Button onClick={() => this.play() }>Play</Button>
          <Button onClick={() => this.stop() }>Stop</Button>
          <Button onClick={() => this.save() }>Save</Button>
          <Button onClick={() => this.load() }>Load</Button>
          <Button onClick={() => this.newTrack() }>Add Track</Button>
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

  // TODO test
  load() {
    // TODO move axios stuff into action
    return axiosClient.get('http://localhost:3001/song')
      .then(response => this.props.replaceSong(response.data))
      .catch(error => { console.log('error on get', error); });
  }

  // TODO test
  save() {
    // const notes = this.notes().allNotes().map(note => note.toJSON());
    // const song = {
    //   name: 'default',
    //   tracks: [{ id: 'track1', name: 'track 1', notes: notes }]
    // };
    //
    // return axiosClient.post('http://localhost:3001/song', song)
    //   .then(response => { })
    //   .catch(error => { console.log('unable to save your song, sorry', error); });
  }

  newTrack() {
    // const updatedSong = {...this.state.song,
    //   tracks: [...this.state.song.tracks, { name: 'track 2', notes: new NoteSequence() }]};
    // this.setState(
    //   () => ({ song: updatedSong }),
    //   () => console.log('added track'));
  }

  // change to take on track number
  notes() {
    // return this.state.song.tracks[0].notes;
  }

  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  play() {
    if (Tone.context.state !== 'running')
        Tone.context.resume();
    var synth = new Tone.PolySynth().toMaster();
    let notes = timeUtil.noteObjects(this.notes().allNotes());
    new Tone.Part((time, note) => {
    	synth.triggerAttackRelease(note.name, note.duration, time);
    }, notes).start();
    Tone.Transport.bpm.value = 144;
    const slightDelayToAvoidSchedulingErrors = '+0.1';
    Tone.Transport.start(slightDelayToAvoidSchedulingErrors);
  }
}

const mapStateToProps = ({song}, ownProps) => {
  return { song };
};

export default connect(mapStateToProps, actions)(App);
