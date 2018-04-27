import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Tone from 'tone';
import logo from './logo.svg';
import Rect from './Rect';
import Note, { height, lineHeight } from './Note';
import './App.css';
import Trig from './Trig';

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

const eighthNote = '8n';
const width = 1200;

class App extends Component {
  constructor() {
    super();
    this.notes = [];
    this.notes.push(new Note("E4", 0));
    this.notes.push(new Note("F4", 1));
    this.notes.push(new Note("G4", 2));
    this.currentNote = -1;
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
    if (this.currentNote < 0) return;
    switch (e.key) {
      case "ArrowUp":
        this.notes[this.currentNote].incrementHalf();
        this.notes[this.currentNote].incrementHalf();
        break;
      case "ArrowDown": {
        this.notes[this.currentNote].decrementHalf();
        this.notes[this.currentNote].decrementHalf();
        break;
      }
      case "ArrowRight": {
        this.notes[this.currentNote++].deselect();
        this.notes[this.currentNote].select();
        break;
      }
      case "ArrowLeft": {
        this.notes[this.currentNote--].deselect();
        this.notes[this.currentNote].select();
        break;
      }
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
    this.notes.forEach(note => note.drawOn(this.context));
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
    this.line(context, 0, 0, 0, height, 7);
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
    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i];
      if (note.isHit(clickPoint)) {
        if (i === this.currentNote) {
          note.deselect();
          this.currentNote = -1; // ugh null object pattern please
          this.draw();
        } else {
          if (this.currentNote >= 0) this.notes[this.currentNote].deselect();
          this.currentNote = i;
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
