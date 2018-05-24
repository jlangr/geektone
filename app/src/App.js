import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Track from './Track';
import Tone from 'tone';
import * as timeUtil from './TimeUtil';
import * as actions from './actions';
import './App.css';

class App extends Component {
  render() {
    const tracks = this.props.song.tracks.map((track, i) => <Track key={i} id={i} />);
    return (
      <div className="App">
        <p>{this.props.song.name}</p>
        { tracks }
        <Form>
          <Button onClick={() => this.play() }>Play</Button>
          <Button onClick={() => this.stop() }>Stop</Button>
          <Button onClick={() => this.props.saveSong(this.props.song) }>Save</Button>
          <Button onClick={this.props.loadSong}>Load</Button>
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

  newTrack() {
    // const updatedSong = {...this.state.song,
    //   tracks: [...this.state.song.tracks, { name: 'track 2', notes: new NoteSequence() }]};
    // this.setState(
    //   () => ({ song: updatedSong }),
    //   () => console.log('added track'));
  }

  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  samples(instrument) {
    switch (instrument) {
      case 'violin': return ['C#1', 'D#1', 'F1', 'G1', 'A1', 'B1', 'C#2', 'D#2', 'F2', 'G2', 'A2', 'C#3', 'D#3', 'F3', 'G3', 'A3', 'B3', 'C#4', 'D#4', 'G4'];
      case 'piano': return [ 
        'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A#0', 'A#1', 'A#2', 'A#3', 'A#4', 'A#5', 'A#6', 
        'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 
        'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C#0', 'C#1', 'C#2', 'C#3', 'C#4', 'C#5', 'C#6', 
        'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D#0', 'D#1', 'D#2', 'D#3', 'D#4', 'D#5', 'D#6',
        'E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6',
        'F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F#0', 'F#1', 'F#2', 'F#3', 'F#4', 'F#5', 'F#6',
        'G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G#0', 'G#1', 'G#2', 'G#3', 'G#4', 'G#5', 'G#6' ];
      default: return [];
    }
  }

//  {[key]:"John"}

  createNoteToFile(instrument) {
    const filename = noteName => `${noteName.replace('#', 's')}.mp3`;
    var noteToFile = {};
    this.samples(instrument).forEach((noteName, i) => noteToFile[noteName] = filename(noteName)); // could use lodash
    console.log(noteToFile);
    return noteToFile;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  createSampler(instrument, noteToFile) {
    return new Tone.Sampler( noteToFile, 
      { 
        'release' : 1, 
        'baseUrl' : `./samples/${instrument}/`,
        'onLoad': () => { console.log('loaded!', instrument)}
      }).toMaster();
  }

  async play() {
    if (Tone.context.state !== 'running')
        Tone.context.resume();

    const notes0 = this.createNoteToFile('piano');
    const notes1 = this.createNoteToFile('violin');

    const synth0 = this.createSampler('piano', notes0);
    const synth1 = this.createSampler('violin', notes1);

    await this.sleep(2000);

    const tracksAsNoteObjects = this.props.song.tracks.map(track => 
      timeUtil.noteObjects(track.notes.allNotes())
    );

    new Tone.Part((time, note) => {
    	synth0.triggerAttackRelease(note.name, note.duration, time);
    }, tracksAsNoteObjects[0]).start();

    new Tone.Part((time, note) => {
    	synth1.triggerAttackRelease(note.name, note.duration, time);
    }, tracksAsNoteObjects[1]).start();

    Tone.Transport.bpm.value = 144;
    const slightDelayToAvoidSchedulingErrors = '+0.1';
    Tone.Transport.start(slightDelayToAvoidSchedulingErrors);
  }
}

const mapStateToProps = ({song}, ownProps) => {
  return { song };
};

const mapDispatchToProps = dispatch => {
  return {
    loadSong: () => dispatch(actions.loadSong()),
    saveSong: song => dispatch(actions.saveSong(song))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
