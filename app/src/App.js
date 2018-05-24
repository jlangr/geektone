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
    let canvasCount = 0;
    const tracks = this.props.song.tracks.map(track => <Track id={canvasCount++} />);
    return (
      <div className="App">
        <p>{this.props.song.name}</p>
        { tracks }
        <Form>
          <Button onClick={() => this.play() }>Play</Button>
          <Button onClick={() => this.stop() }>Stop</Button>
          <Button onClick={() => this.save() }>Save</Button>
          <Button onClick={() => { console.log('load'); this.props.loadSong() }}>Load</Button>
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

  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  play() {
    if (Tone.context.state !== 'running')
        Tone.context.resume();
    var synth = new Tone.PolySynth().toMaster();
    const tracksAsNoteObjects = this.props.song.tracks.map(track => 
      timeUtil.noteObjects(track.notes.allNotes())
    );
    const allNotes = 
      tracksAsNoteObjects.reduce((notes, trackNoteObjects) => notes.concat(trackNoteObjects), []);

    new Tone.Part((time, note) => {
    	synth.triggerAttackRelease(note.name, note.duration, time);
    }, allNotes).start();
    Tone.Transport.bpm.value = 144;
    const slightDelayToAvoidSchedulingErrors = '+0.1';
    Tone.Transport.start(slightDelayToAvoidSchedulingErrors);
  }
}

const mapStateToProps = ({song}, ownProps) => {
  return { song };
};

export default connect(mapStateToProps, { loadSong: actions.loadSong })(App);
