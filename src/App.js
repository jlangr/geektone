import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Tone from 'tone';
import Note, { height, lineHeight } from './Note';
import './App.css';

  // F ---
  // E
  // D ---
  // C
  // B ---
  // A
  // G ---
  // F
  // E ---
  // D
  // C (---)

const width = 1200;

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentNote: -1,
      notes: [new Note("E4", 0), new Note("F4", 1), new Note("G4", 2)]
    };
  }

  componentDidMount() {
    // next can go in componentWillMount?
    document.getElementById('staff').addEventListener('keyup', this.handleKeyPress.bind(this));
    this.init();
  }

  init() {
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
        </Form>
      </div>
    );
  }

  canvas() {
    return document.getElementById("staff");
  }

  // TODO introduce abstraction for note list

  handleKeyPress(e) {
    if (this.state.currentNote < 0) return;
    switch (e.key) {
      case "ArrowUp":
        this.state.notes[this.state.currentNote].incrementHalf();
        this.state.notes[this.state.currentNote].incrementHalf();
        break;
      case "ArrowDown":
        this.state.notes[this.state.currentNote].decrementHalf();
        this.state.notes[this.state.currentNote].decrementHalf();
        break;
      case "ArrowRight":
        this.state.notes[this.state.currentNote++].deselect();
        this.state.notes[this.state.currentNote].select();
        break;
      case "ArrowLeft":
        this.state.notes[this.state.currentNote--].deselect();
        this.state.notes[this.state.currentNote].select();
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
    this.state.notes.forEach(note => note.drawOn(this.context));
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
    // awful
    const clickPoint = this.mousePosition(this.canvas(), e);
    for (let i = 0; i < this.state.notes.length; i++) {
      const note = this.state.notes[i];
      if (note.isHit(clickPoint)) {
        if (i === this.state.currentNote) {
          note.deselect();
          this.state.currentNote = -1; // ugh null object pattern please
          this.draw();
        } else {
          if (this.state.currentNote >= 0) this.state.notes[this.state.currentNote].deselect();
          this.state.currentNote = i;
          note.select();
          this.draw();
        }
      }
    }
//      note.click(this.context, this.mousePosition(this.canvas(), e)));
  }

  play() {
    var synth = new Tone.FMSynth().toMaster();
    var pattern = new Tone.Pattern(function(time, note){
    	synth.triggerAttackRelease(note, 0.25);
    }, ["C4", "E4", "G4", "A4"]);
    pattern.start(0);
    Tone.Transport.start();
  }
}

export default App;
