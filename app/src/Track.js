import React, { Component } from 'react';
import Note from './Note';
import NoteSequence from './NoteSequence';
import { drawStaff, drawSharp } from './Staff';
import * as keyHandler from './KeyHandler';

import axios from 'axios';
const axiosClient = axios.create({ baseURL: 'http://localhost:3001', timeout: 4000});

class Track extends Component {
  constructor() {
    super();
    this.state = { notes: new NoteSequence() };
//    this.loadTrack();
  }

  componentDidMount() {
    this.addKeyListeners();
    this.addMouseListener();
    this.draw();
  }

  loadTrack() {
    let thisCanvas = this;
    axiosClient.get('http://localhost:3001/song')
      .then(response => {
        const receivedNotes = response.data.tracks[0].notes;
        const noteSequence = new NoteSequence();
        receivedNotes.forEach(note => noteSequence.add(new Note(note.name, note.duration)));

        thisCanvas.setState(
          () => ({ notes: noteSequence }),
          () => this.draw());
      })
      .catch(error => { console.log('error on get', error); });
  }

  trackId(id) {
    return `track${id}`;
  }

  addMouseListener() {
    this.canvas().addEventListener('mousedown', this.click.bind(this));
  }

  addKeyListeners() {
    const canvas = document.getElementById(this.trackId(this.props.id));
    canvas.addEventListener('keyup', this.handleKeyPress.bind(this));
  }

  render() {
    return <div><canvas id={this.trackId(this.props.id)} border='0' tabIndex={this.props.id} width='1200' height='144'
      style={{marginLeft: 10, marginRight: 10, marginTop: 20}} /></div>;
  }

  trackContext() {
    return this.canvas().getContext('2d');
  }

  canvas() {
    return document.getElementById(this.trackId(this.props.id));
  }

  testDrawSharps(context) {
    drawSharp(context, 'E4', 1);
    drawSharp(context, 'F4', 3);
    drawSharp(context, 'G4', 2);
    drawSharp(context, 'A4', 4);
  }

  handleKeyPress(e) {
    if (e.key === '#') { this.testDrawSharps(this.trackContext()); return; }
    if (e.key === 's') { this.save(); return; }
    if (keyHandler.handleKey(e, this.state.notes)) this.draw();
  }

  draw() {
    this.trackContext().clearRect(0, 0, this.canvas().width, this.canvas().height);
    drawStaff(this.trackContext());
    // TODO use forin
    let i = 0;
    this.state.notes.allNotes()
      .forEach(note => note.drawOn(this.trackContext(), i++));
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
    if (this.state.notes.clickHitNote(clickPoint))
      this.draw();
  }
}

export default Track;
