import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Tone from 'tone';
import Note from './Note';
import NoteSequence from './NoteSequence';
import { drawStaff, drawSharp } from './Staff';
import * as keyHandler from './KeyHandler';
import * as timeUtil from './TimeUtil';
import './App.css';

import axios from 'axios';

const axiosClient = axios.create({ baseURL: 'http://localhost:3001', timeout: 4000});

class App extends Component {
  constructor() {
    super();
    this.state = {
      noteSequence: new NoteSequence(),
      currentNote: new Note('--')
    };
    this.state.noteSequence.add(new Note('E4'));
  }

  componentDidMount() {
    document.getElementById('staff').addEventListener('keyup', this.handleKeyPress.bind(this));
    this.context = this.canvas().getContext("2d");
    this.canvas().addEventListener('mousedown', this.click.bind(this));
    this.draw();
  }

  render() {
    return (
      <div className="App">
        <canvas id="staff" tabIndex="1" width="1200" height="200"
          style={{marginLeft: 10, marginRight: 10, marginTop: 20}} />
        <Form>
          <Button onClick={() => this.play() }>Play</Button>
          <Button onClick={() => this.stop() }>Stop</Button>
          <Button onClick={() => this.save() }>Save</Button>
          <Button onClick={() => this.load() }>Load</Button>
          <p>left/right arrows: select prev / next note <br />
          up/down arrows:  move selected note up / down <br />
          d     duplicate <br />
          x     delete <br />
          1: whole 2: half 3: dotted half 4: quarter 8: eighth *: double length /: halve length
          </p>
          <p>
          <input value={this.state.currentNote.name()} />
          </p>
        </Form>
      </div>
    );
  }

  canvas() {
    return document.getElementById("staff");
  }

  testDrawSharps(context) {
    drawSharp(context, 'E4', 1);
    drawSharp(context, 'F4', 3);
    drawSharp(context, 'G4', 2);
    drawSharp(context, 'A4', 4);
  }

  // TODO test
  load() {
    const app = this;
    return axiosClient.get('http://localhost:3001/song')
      .then(response => {
        console.log('notes count', response.data.tracks[0].notes.length);
        const noteSequence = new NoteSequence();
        response.data.tracks[0].notes.forEach(note => {
          noteSequence.add(new Note(note.name, note.duration));
        });
        app.setState({ noteSequence: noteSequence, currentNote: noteSequence.firstNote() });
        app.context = app.canvas().getContext("2d");
        app.drawUsing(app.context);
      })
      .catch(error => { console.log('error on get', error); });
  }

  // TODO test
  save() {
    const notes = this.state.noteSequence.allNotes()
      .map(note => note.toJSON());

    const song = {
      name: 'default',
      tracks: [{ name: 'track 1', notes: notes }]
    };

    return axiosClient.post('http://localhost:3001/song', song)
      .then(response => { })
      .catch(error => { console.log('unable to save your song, sorry', error); });
  }

  handleKeyPress(e) {
    if (e.key === '#') { this.testDrawSharps(this.context); return; }
    if (e.key === 's') { this.save(); return; }
    if (keyHandler.handleKey(e, this.state.noteSequence)) this.draw();
  }

  draw() {
    this.drawUsing(this.context);
  }

  drawUsing(context) {
    context.clearRect(0, 0, this.canvas().width, this.canvas().height);
    drawStaff(this.context);
    let i = 0;
    this.state.noteSequence.allNotes()
      .forEach(note => note.drawOn(this.context, i++));
  }

  mousePosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  click(e) {
    const clickPoint = this.mousePosition(this.canvas(), e);
    console.log('click point', clickPoint);
    if (this.state.noteSequence.clickHitNote(clickPoint))
      this.draw();
  }

  stop() {
    Tone.Transport.stop();
  }

  play() {
    var synth = new Tone.PolySynth().toMaster();
    let notes = timeUtil.noteObjects(this.state.noteSequence.allNotes());
    console.log('notes to play:', notes);
    new Tone.Part((time, note) => {
    	synth.triggerAttackRelease(note.name, note.duration, time);
    }, notes).start();
    Tone.Transport.bpm.value = 144;
    Tone.Transport.start();
  }
}

export default App;
