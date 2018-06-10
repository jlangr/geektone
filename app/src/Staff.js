import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as keyHandler from './KeyHandler';
import { lineHeight, sharpArea, sharpWidth, sharpsInWidth } from './Note';
import { addSharp } from './actions';
import { isInSharpsMode, trackData } from './reducers/SongReducer';
import { nearestNote, noteY } from './reducers/UIReducer';
import * as UI from './util/UI';

const staffWidth = 1200;
const highlightColor = 'red'; // move to ui constants source
const trebleStaffNotes = [ 'A6', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4' ];
const trebleStaffLines = [ 'F5', 'D5', 'B4', 'G4', 'E4' ];

export const verticalIndex = noteName => {
  return trebleStaffNotes.indexOf(noteName);
};

export class Staff extends Component {
  componentDidMount() {
    this.addKeyListeners();
    this.addMouseListener();
    this.draw();
  }

  // check what changed?
  componentDidUpdate() {
    this.draw();
  }

  render() {
    return (
      <div>
        <canvas id={this.props.id} 
          tabIndex={this.props.id}
          border='0' width='1200' height='144'
          style={{marginLeft: 10, marginRight: 10, marginTop: 20}} />
      </div>
    );  // note: tabIndex needed for key events
  }

  canvas() {
    return document.getElementById(this.props.id);
  }

  staffContext() {
    return this.canvas().getContext('2d');
  }

  addMouseListener() {
    this.canvas().addEventListener('mousedown', this.click.bind(this));
  }

  addKeyListeners() {
    this.canvas().addEventListener('keyup', this.handleKeyPress.bind(this));
  }

  handleKeyPress(e) {
    if (keyHandler.handleKey(e, this.props.trackData.notes)) this.draw();
  }

  click(e) {
    const clickPoint = UI.mousePosition(this.canvas(), e);
    if (this.props.isInSharpsMode) {
      if (this.isClickInAccidentals(clickPoint)) {
        this.props.addSharp(this.props.id, this.props.nearestNote(clickPoint));
        this.draw();
      }
    } else
      if (this.props.trackData.notes.clickHitNote(clickPoint))
        this.draw();
  }

  // TODO test
  isClickInAccidentals(point) {
    return this.props.ui.staff.accidentalsRect.contains(point);
  }

  y(noteName) {
    return (verticalIndex(noteName) * lineHeight / 2);
  }

  draw() {
    this.staffContext().clearRect(0, 0, this.canvas().width, this.canvas().height);
    this.drawStaffLines();
    this.props.trackData.notes.allNotes()
      .forEach((note, i) => note.drawOn(this.staffContext(), i));
  }

  drawStaffLines() {
    this.staffContext().beginPath();

    const topLineY = this.y(trebleStaffLines[0]);
    for (let i = 0; i < trebleStaffLines.length; i++) {
      const currentY = this.y(trebleStaffLines[i]);
      this.drawLine(0, currentY, staffWidth, currentY);
    }
    this.staffHeight = trebleStaffLines.length * lineHeight;
    this.drawLine(staffWidth, topLineY, staffWidth, this.staffHeight);
    this.staffContext().stroke();
    this.drawAccidentalsArea();
  }

  drawLine(xStart, yStart, xEnd, yEnd, weight=1, color='black') {
    this.staffContext().strokeStyle = color;
    this.staffContext().lineWidth = weight;
    this.staffContext().moveTo(xStart, yStart);
    this.staffContext().lineTo(xEnd, yEnd);
  }

  drawSharp(note, sharpIndex) {
    const sharpHeight = 20;
    const staffWidthBetweenUpstrokes = sharpWidth / 4;

    this.staffContext().beginPath();

    const y = noteY(note) + 4;
    const x = (sharpIndex % sharpsInWidth) * sharpArea + sharpWidth;

    let top = y - (sharpHeight / 2);
    let bottom = y + (sharpHeight / 2);
    let upstrokeLeft = x - (staffWidthBetweenUpstrokes / 2);
    let upstrokeRight = x + (staffWidthBetweenUpstrokes / 2);

    let verticalOffset = sharpHeight / 3;

    let weight = 2;
    this.drawLine(upstrokeLeft, top, upstrokeLeft, bottom, weight);
    this.drawLine(upstrokeRight, top - verticalOffset, upstrokeRight, bottom - verticalOffset, weight);

    this.staffContext().stroke();

    this.staffContext().beginPath();
    weight = 4;
    let left = x - (sharpWidth / 2);
    let right = x + (sharpWidth / 2);
    let upslashYstart = y - (sharpHeight / 4);
    let upslashYend = upslashYstart - verticalOffset;
    this.drawLine(left, upslashYstart, right, upslashYend, weight);

    upslashYstart = y + (sharpHeight / 4);
    upslashYend = upslashYstart - verticalOffset;
    this.drawLine(left, upslashYstart, right, upslashYend, weight);
    this.staffContext().stroke();
  }

  drawAccidentalsArea() {
    if (this.props.isInSharpsMode) {
      this.staffContext().beginPath();
      const lineWidth = 6;
      this.props.ui.staff.accidentalsRect.drawOn(this.staffContext(), highlightColor, lineWidth);
      this.staffContext().stroke();
    }

    if (this.props.trackData.sharps)
      this.props.trackData.sharps.forEach((note, i) => {
        this.drawSharp(note, i);
    });
  }
}

const mapStateToProps = ({ ui, composition }, ownProps) => {
  const song = composition.song;
  return { 
    trackData: trackData(composition, ownProps.id),
    isInSharpsMode: isInSharpsMode(song, ownProps.id),
    nearestNote: point => nearestNote(ui, point),
    ui, 
    song };
};

const mapDispatchToProps = { addSharp };

export default connect(mapStateToProps, mapDispatchToProps)(Staff);