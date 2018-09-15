import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as keyHandler from './KeyHandler'
import { sharpArea, sharpWidth, sharpsInWidth } from './Note'
import { addSharp, updateTrack } from './actions'
import { isInSharpsMode, barsAndNotes, trackData } from './reducers/SongReducer'
import { nearestNote, noteY } from './reducers/UIReducer'
import * as UI from './util/UI'
import * as Draw from './util/Draw'

const staffWidth = 1600;
const highlightColor = 'red'; // move to ui constants source


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
  // TODO move to query on props
  isClickInAccidentals(point) {
    return this.props.ui.staff.accidentalsRect.contains(point);
  }

  draw() {
    this.staffContext().clearRect(0, 0, this.canvas().width, this.canvas().height);
    this.drawStaffLines(); // TODO full length!
    this.props.barsAndNotes.forEach(x => 
      x.drawOn(this.staffContext()));
  }

  drawStaffLines() {
    this.staffContext().beginPath();

    // forEach
    for (let i = 0; i < Draw.trebleStaffLines.length; i++) {
      const currentY = Draw.y(Draw.trebleStaffLines[i]);
      Draw.drawLine(this.staffContext(), 0, currentY, staffWidth, currentY);
    }
    Draw.drawLine(this.staffContext(), staffWidth, Draw.topLineY(), staffWidth, Draw.staffHeight);
    this.staffContext().stroke();
    this.drawAccidentalsArea();
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
    Draw.drawLine(this.staffContext(), upstrokeLeft, top, upstrokeLeft, bottom, weight);
    Draw.drawLine(this.staffContext(), upstrokeRight, top - verticalOffset, upstrokeRight, bottom - verticalOffset, weight);

    this.staffContext().stroke();

    this.staffContext().beginPath();
    weight = 4;
    let left = x - (sharpWidth / 2);
    let right = x + (sharpWidth / 2);
    let upslashYstart = y - (sharpHeight / 4);
    let upslashYend = upslashYstart - verticalOffset;
    Draw.drawLine(this.staffContext(), left, upslashYstart, right, upslashYend, weight);

    upslashYstart = y + (sharpHeight / 4);
    upslashYend = upslashYstart - verticalOffset;
    Draw.drawLine(this.staffContext(), left, upslashYstart, right, upslashYend, weight);
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
  const dataForTrack = trackData(composition, trackId);
  return { 
    trackData: dataForTrack,
    isInSharpsMode: isInSharpsMode(song, trackId),
    nearestNote: point => nearestNote(ui, point),
    barsAndNotes: barsAndNotes(song, dataForTrack),
    ui, 
    song };
};

const mapDispatchToProps = { addSharp, updateTrack };

export default connect(mapStateToProps, mapDispatchToProps)(Staff);