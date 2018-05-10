import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Tone from 'tone';
import Note, { whole, half, quarter, eighth } from './Note';
import NoteSequence from './NoteSequence';
import { drawStaff, drawSharp } from './Staff';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      noteSequence: new NoteSequence(),
      currentNote: new Note('--')
    };
    this.state.noteSequence.onNoteChange(note => {
      console.log("onNoteChange", note);
//      this.setState({currentNote: note});
    });
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
    console.log('this.state.noteSequence.selectedNote', this.state.noteSequence.selectedNote());
    return this.state.noteSequence.selectedNote().name();
  }

  canvas() {
    return document.getElementById("staff");
  }

  // TODO test
  handleKeyPress(e) {
    if (e.key === '#') {
      drawSharp(this.context, 'E4', 1);
      drawSharp(this.context, 'F4', 3);
      drawSharp(this.context, 'G4', 2);
      drawSharp(this.context, 'A4', 4);
      return;
    }

    if (!this.state.noteSequence.isNoteSelected()) return;
    switch (e.key) {
      // TODO change to incrementSelected / decrementSelected
      case 'ArrowUp':    this.state.noteSequence.selectedNote().increment(); break;
      case 'ArrowDown':  this.state.noteSequence.selectedNote().decrement(); break;
      case 'ArrowLeft':  this.state.noteSequence.selectPrev(); break;
      case 'ArrowRight': this.state.noteSequence.selectNext(); break;
      case 'd': this.state.noteSequence.duplicateNote(); break;
      case 'x': this.state.noteSequence.deleteSelected(); break;
      case '8': this.state.noteSequence.setSelectedTo(eighth); break;
      case '4': this.state.noteSequence.setSelectedTo(whole); break;
      case '2': this.state.noteSequence.setSelectedTo(half); break;
      case '1': this.state.noteSequence.setSelectedTo(quarter); break;
      case '.': this.state.noteSequence.toggleDotForSelected(); break;
      default: return;
    }
    this.draw();
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas().width, this.canvas().height);
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
    const notes = this.state.noteSequence.allNotes();
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.isHit(clickPoint, i)) {
        this.state.noteSequence.click(i);
        this.draw();
        break;
      }
    }
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
    var synth = new Tone.FMSynth().toMaster();

    // const notes = [
    //   { name: 'C4', duration: '8n', time: '0'},
    //   { name: 'D4', duration: '8n', time: '0:0:2'},
    //   { name: 'E4', duration: '8n', time: '0:1'}
    // ];
    let notes = this.noteObjects(this.state.noteSequence.allNotes());
    console.log('notes:', notes);

    var part = new Tone.Part((time, note) => {
    	synth.triggerAttackRelease(note.name, note.duration, time);
    }, notes).start();

    Tone.Transport.start();
  }
}

export default App;
