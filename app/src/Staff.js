import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as keyHandler from './KeyHandler';
import { lineHeight, sharpArea, sharpsArea, notePad, noteDistance, sharpWidth, sharpsInWidth } from './Note';
import { addSharp, updateTrack } from './actions';
import { isInSharpsMode, trackData } from './reducers/SongReducer';
import { nearestNote, noteY } from './reducers/UIReducer';
import * as UI from './util/UI';

const staffWidth = 1600;
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

  componentDidUpdate() {
    this.draw();
  }

  render() {
    return (
      <div>
        <canvas ref='canvas' id={this.props.id}
          tabIndex={this.props.id}
          border='0' width={staffWidth} height='144'
          style={{marginLeft: 10, marginRight: 10, marginTop: 20}} />
      </div>
    );  // note: tabIndex needed for key events
  }

  canvas() {
    return this.refs.canvas;
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
    if (keyHandler.handleKey(e, this.props.trackData.notes)) {
      this.props.updateTrack(this.props.id); // TODO only if it's a rebar change? or not.
      // this.draw();
    }
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

  x(position) {
    return sharpsArea + notePad + (position * (noteDistance + notePad));
  }

  topLineY() {
    return this.y(trebleStaffLines[0]);
  }

  drawBar(position) {
    const x = this.x(position);
    this.staffContext().beginPath();
    this.drawLine(x, this.topLineY(), x, this.staffHeight);
    this.staffContext().stroke();
  }

  draw() {
    console.log(`redraw canvas id: ${this.props.id}`);
    const barsForOtherTracks = this.props.song.tracks
      .filter(track => track.name !== this.props.trackData.name)
      .map(track => track.notes.bars());

    this.staffContext().clearRect(0, 0, this.canvas().width, this.canvas().height);
    this.drawStaffLines(); // TODO full length!
    let barPosition = 0;
    console.log(`in draw; bar count: ${this.props.trackData.notes.bars().length}`)
    this.props.trackData.notes.bars()
      .forEach((bar, i) => {
        console.log(`\t\tbar ${i}`)
        const crossBars = barsForOtherTracks.map(bars => bars[i]).filter(bar => bar !== undefined);
        const allPositionsRequiredForBar =
          crossBars.map(bar => bar.positionsRequired());
        const positionsRequired = Math.max(...allPositionsRequiredForBar, bar.positionsRequired());
        bar.layouts(positionsRequired).forEach(({ note, position }) => {
          console.log(`\t\t\t${note} ${position}`)
          note.position = barPosition + position; // note! update to note
          note.drawOn(this.staffContext());
        });
        barPosition += positionsRequired;
        this.drawBar(barPosition++);
      });

      /*
          barPos notePos notePos notePos notePos barPos ... */ 


      // TODO: redraw other staffs 
      // should happen somehow automatically via reducer / state update
  }

  drawStaffLines() {
    this.staffContext().beginPath();

    for (let i = 0; i < trebleStaffLines.length; i++) {
      const currentY = this.y(trebleStaffLines[i]);
      this.drawLine(0, currentY, staffWidth, currentY);
    }
    this.staffHeight = trebleStaffLines.length * lineHeight;
    this.drawLine(staffWidth, this.topLineY(), staffWidth, this.staffHeight);
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
  const trackId = ownProps.id;
  return { 
    trackData: trackData(composition, trackId),
    isInSharpsMode: isInSharpsMode(song, trackId),
    nearestNote: point => nearestNote(ui, point),
    ui, 
    song };
};

const mapDispatchToProps = { addSharp, updateTrack };

export default connect(mapStateToProps, mapDispatchToProps)(Staff);