import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drawStaff, drawSharp } from './Staff';
import * as keyHandler from './KeyHandler';

export class Track extends Component {
  componentDidMount() {
    this.addKeyListeners();
    this.addMouseListener();
    this.draw();
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
    return <canvas key={this.props.id} id={this.trackId(this.props.id)} border='0' tabIndex={this.props.id} 
          width='1200' height='144'
          style={{marginLeft: 10, marginRight: 10, marginTop: 20}} />;
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
    if (keyHandler.handleKey(e, this.trackData().notes)) this.draw();
  }

  trackData() {
    return this.props.song.tracks[this.props.id];
  }

  draw() {
    this.trackContext().clearRect(0, 0, this.canvas().width, this.canvas().height);
    drawStaff(this.trackContext());
    this.trackData().notes.allNotes()
      .forEach((note, i) => note.drawOn(this.trackContext(), i));
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
    if (this.trackData().notes.clickHitNote(clickPoint))
      this.draw();
  }
}

export default connect(({song}) => ({song}))(Track);