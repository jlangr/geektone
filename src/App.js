import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Tone from 'tone';
import Note, { whole, half, quarter } from './Note';
import NoteSequence from './NoteSequence';
import { drawStaff, drawSharp } from './Staff';
import './App.css';

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
          x     delete note <br />
          1: whole 2: half 3: dotted half 4: quarter 8: eighth *: double length /: halve length
          </p>
        </Form>
      </div>
    );
  }

  canvas() {
    return document.getElementById("staff");
  }

  // TODO test
  handleKeyPress(e) {
    if (e.key === '#') {
      drawSharp(this.context, 'E4');
      // drawSharp(this.context, 'F4');
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

  notes() {
    return this.state.noteSequence.allNotes().map(note => note.name());
  }

  stop() {
    Tone.Transport.stop();
  }

  play() {
var synth = new Tone.FMSynth().toMaster()

//schedule a series of notes to play as soon as the page loads
synth.triggerAttackRelease('C4', '4n', '8n')
synth.triggerAttackRelease('E4', '8n', '4n + 8n')
synth.triggerAttackRelease('G4', '16n', '2n')
synth.triggerAttackRelease('B4', '16n', '2n + 8t')
synth.triggerAttackRelease('G4', '16','2n + 8t * 2')
synth.triggerAttackRelease('E4', '2n', '0:3')
//var synth = new Tone.PluckSynth().toMaster();
    // // const pattern = new Tone.Pattern(function(time, note){
    // // 	synth.triggerAttackRelease(note, 0.25);
    // // }, this.notes());
    // Tone.Transport.bpm.value = 170;
    //
    // const  this.state.noteSequence.allNotes().forEach(note => {
    // //   synth.triggerAttackRelease(note.name(), note.duration);
    // // });
    //
    // var loop = new Tone.Loop(time => {
    // 	 synth.triggerAttackRelease("C2", "8n", time);
    //   },
    //   "4n");
    //
    // loop.start("1m").stop("4m");
    //
    // Tone.Transport.start();
  }
}

export default App;
