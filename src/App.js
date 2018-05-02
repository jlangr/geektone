import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Tone from 'tone';
import Note, { height, lineHeight } from './Note';
import NoteSequence from './NoteSequence';
import './App.css';

const width = 1200;

const nullSelectable = {
  select: () => {},
  deselect: () => {}
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentNote: -1,
      currNote: nullSelectable,
      noteSequence: new NoteSequence()
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
          d     duplicate note <br />
          </p>
        </Form>
      </div>
    );
  }

  canvas() {
    return document.getElementById("staff");
  }

  handleKeyPress(e) {
    if (!this.state.noteSequence.isNoteSelected()) return;
    switch (e.key) {
      case 'ArrowUp':
        this.state.noteSequence.selectedNote().increment();
        break;
      case 'ArrowDown':
        this.state.noteSequence.selectedNote().decrement();
        break;
      case 'ArrowRight':
        this.state.noteSequence.selectNext();
        break;
      case 'ArrowLeft':
        this.state.noteSequence.selectPrev();
        break;
      case 'd':
        this.state.noteSequence.duplicateNote();
        break;
      default:
        return;
    }
    this.draw();
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas().width, this.canvas().height);
    this.drawStaff(this.context);
    this.drawNotes();
  }

  drawNotes() {
    let i = 0;
    this.state.noteSequence.allNotes()
      .forEach(note => note.drawOn(this.context, i++));
  }

  line(context, xStart, yStart, xEnd, yEnd, weight=1) {
    context.stroke();
    context.lineWidth = weight;
    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);
    context.stroke();
  }

  drawStaff(context) {
    context.beginPath();
    const beginningStaffWidth = 7;
    this.line(context, 0, 0, 0, height, beginningStaffWidth);
    for (let i = 0, currentY = 0; i < 5; i++) {
      this.line(context, 0, currentY, width, currentY);
      currentY += lineHeight;
    }
    this.line(context, width, 0, width, height);
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

  notes() {
    return this.state.noteSequence.allNotes().map(note => note.name());
  }

  stop() {
    Tone.Transport.stop();
  }

  play() {
    var synth = new Tone.FMSynth().toMaster();
    const pattern = new Tone.Pattern(function(time, note){
    	synth.triggerAttackRelease(note, 0.25);
    }, this.notes());
    pattern.start(0);
    Tone.Transport.start();
  }
}

export default App;
