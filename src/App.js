import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Tone from 'tone';
import Note from './Note';
import NoteSequence from './NoteSequence';
import { drawStaff, drawSharp } from './Staff';
import * as keyHandler from './KeyHandler';
import './App.css';

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

  currentNoteInfo() {
    return this.state.noteSequence.selectedNote().name();
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

  handleKeyPress(e) {
    if (e.key === '#') this.testDrawSharps(this.context);
    if (keyHandler.handleKey(e, this.state.noteSequence)) this.draw();
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas().width, this.canvas().height);
    drawStaff(this.context);
    let i = 0;
    this.state.noteSequence.allNotes()
      .forEach(note => note.drawOn(this.context, i++));
  }

  // TODO test
  mousePosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  click(e) {
    const clickPoint = this.mousePosition(this.canvas(), e);
    if (this.state.noteSequence.clickHitNote(clickPoint))
      this.draw();
  }

  stop() {
    Tone.Transport.stop();
  }

  transportTime(totalSixteenths) {
    const measures = Math.floor(totalSixteenths / 16);
    const measureSixteenths = totalSixteenths % 16;
    const quarters = Math.floor(measureSixteenths / 4);
    const sixteenths = totalSixteenths % 4;
    return `${measures}:${quarters}:${sixteenths}`;
  }

  time(noteDuration) {
    switch (noteDuration) {
      case '16n': return 1;
      case '8n': return 2;
      case '4n': return 4;
      case '2n': return 8;
      case '1n': return 16;
      default: return 4;
    }
  }

  noteObjects(notes) {
    const result = [];
    let startSixteenths = 0;
    notes.forEach(note => {
      let startTime = this.transportTime(startSixteenths);
      result.push({ name: note.name(), duration: note.duration, time: startTime });
      startSixteenths += this.time(note.duration);
    });
    return result;
  }

  play() {
    var synth = new Tone.PolySynth().toMaster();
    let notes = this.noteObjects(this.state.noteSequence.allNotes());
    new Tone.Part((time, note) => {
    	synth.triggerAttackRelease(note.name, note.duration, time);
    }, notes).start();
    Tone.Transport.start();
  }
}

export default App;
