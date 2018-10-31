import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as KeyHandler from './KeyHandler'
import { addFlat, addSharp, keyFocusUpdate, markDirty, setSelectionStart, updateTrack } from './actions'
import { hasBassNotes, hasTrebleNotes, isInFlatsMode, isInSharpsMode, barsAndNotes, trackData } from './reducers/SongReducer'
import { isClickInAccidentals, isNewEvent, nearestNote, staffHeight } from './reducers/UIReducer'
import * as UI from './util/UI'
import * as Constants from './Constants'
import * as Draw from './util/Draw'

const highlightColor = 'red'
const bassClefSymbol = '\uD834\uDD22'
const trebleClefSymbol = '\uD834\uDD1E'
const sharpSymbol = '\u266F'
const flatSymbol = '\u266D'

export class Staff extends Component {
  componentDidMount() {
    this.addKeyListeners()
    this.addMouseListener()
    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  render() {
    return (
      <div>
        <canvas ref='canvas' id={this.props.id}
          tabIndex={this.props.id}
          border='0' width={this.staffWidth()} 
          height={this.props.staffHeight()}
          style={{marginLeft: 10, marginRight: 10, marginTop: 20}} />
      </div>
    )  // tabIndex: needed for key events
  }

  staffWidth() {
    const lastNotePosition = Draw.accidentalsLeft + this.props.barsAndNotes[this.props.barsAndNotes.length - 1].position
    return Draw.x(2 + lastNotePosition)
  }

  canvas() {
    return this.refs.canvas
  }

  staffContext() {
    return this.canvas().getContext('2d')
  }

  addMouseListener() {
    this.canvas().addEventListener('mousedown', this.click.bind(this))
  }

  addKeyListeners() {
    this.canvas().addEventListener('keyup', this.handleKeyPress.bind(this))
  }

  // TODO more tests
  handleKeyPress(e) {
    if (this.props.isNewEvent(e) &&
        KeyHandler.handleKey(e, this.props.trackData.notes)) {
      this.props.updateTrack(this.props.id)
      this.props.keyFocusUpdate(this, e)
      if (!KeyHandler.isSelectionChangeOnly(e))
        this.props.markDirty()
    }
  }

  // TODO test
  click(e) {
    const clickPoint = UI.mousePosition(this.canvas(), e)
    if (this.props.isClickInAccidentals(clickPoint)) {
      if (this.props.isInSharpsMode)
        this.props.addSharp(this.props.id, this.props.nearestNote(clickPoint))
      else if (this.props.isInFlatsMode)
        this.props.addFlat(this.props.id, this.props.nearestNote(clickPoint))
    }
    else if (this.props.trackData.notes.clickHitNote(clickPoint)) 
        this.props.updateTrack(this.props.id)
    else
      this.props.setSelectionStart(clickPoint, this.canvas().height)
  }

  draw() {
    this.staffContext().clearRect(0, 0, this.canvas().width, this.canvas().height)
    this.props.barsAndNotes.forEach(x => 
      x.drawOn(this.staffContext(),
                hasTrebleNotes(this.props.song, this.props.id),
                hasBassNotes(this.props.song, this.props.id)))
    this.drawStaffLines()
    this.drawSelectionStart()
  }

  drawSelectionStart() {
    this.props.ui.staff.selectionStartLine.drawOn(this.staffContext())
  }

  drawStaff(lines) {
    this.staffContext().beginPath()
    lines.forEach(line => {
      const currentY = Draw.y(line)
      Draw.drawLine(this.staffContext(), 0, currentY, this.staffWidth(), currentY)
    })
    this.staffContext().stroke()
    this.drawAccidentalsArea()
  }

  drawText(text, x, y, px) {
    this.staffContext().beginPath()
    this.staffContext().fillStyle = 'black'
    this.staffContext().font = `${px}px Arial`
    this.staffContext().fillText(text, x, y)
    this.staffContext().stroke()
  }

  drawStaffLines() {
    this.drawStaff(Constants.trebleStaffLines)
    this.drawText(trebleClefSymbol, 
      10, Draw.y(Constants.TrebleStaffClefY), Draw.staffHeight * 7 / 10)

    if (hasBassNotes(this.props.song, this.props.id)) {
      this.drawStaff(Constants.bassStaffLines)
      this.drawText(bassClefSymbol, 
        10, Draw.y(Constants.BassStaffClefY), Draw.staffHeight * 5 / 10)
    }
  }

  drawSharp(note, sharpIndex) {
    const x = Draw.accidentalsLeft + (sharpIndex % Draw.sharpsInWidth) * Draw.sharpArea + Draw.sharpWidth
    const y = Draw.y(note) + 6
    const px = Draw.lineHeight + 6
    this.drawText(sharpSymbol, x, y, px)
  }

  drawFlat(note, sharpIndex) {
    const y = Draw.y(note) + 6
    const x = Draw.accidentalsLeft + (sharpIndex % Draw.sharpsInWidth) * Draw.sharpArea + Draw.sharpWidth
    const px = Draw.lineHeight + 6
    this.drawText(flatSymbol, x, y, px)
  }

  drawAccidentalsArea() {
    if (this.props.isInSharpsMode || this.props.isInFlatsMode) {
      this.staffContext().beginPath()
      const lineWidth = 6
      this.props.ui.staff.accidentalsRect.drawOn(this.staffContext(), highlightColor, lineWidth)
      this.staffContext().stroke()
    }

    if (this.props.trackData.sharps)
      this.props.trackData.sharps.forEach((note, i) => {
        this.drawSharp(note, i)
      })

    if (this.props.trackData.flats) {
      const drawOffset = this.props.trackData.sharps 
        ? this.props.trackData.sharps.length
        : 0
      this.props.trackData.flats.forEach((note, i) => {
        this.drawFlat(note, i + drawOffset)
      })
    }
  }
}

const mapStateToProps = ({ ui, composition }, ownProps) => {
  const song = composition.song
  const trackId = ownProps.id
  const dataForTrack = trackData(composition, trackId)
  return { 
    trackData: dataForTrack,
    isClickInAccidentals: point => isClickInAccidentals(ui, point),
    isInSharpsMode: isInSharpsMode(song, trackId),
    isInFlatsMode: isInFlatsMode(song, trackId),
    isNewEvent: event => isNewEvent(ui, event),
    nearestNote: point => nearestNote(ui, point),
    barsAndNotes: barsAndNotes(song, dataForTrack),
    staffHeight: () => staffHeight(song, trackId),
    ui, 
    song }
}

const mapDispatchToProps = { addSharp, addFlat, keyFocusUpdate, markDirty, updateTrack, setSelectionStart }

export default connect(mapStateToProps, mapDispatchToProps)(Staff)