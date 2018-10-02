import RebarCommand from './RebarCommand'

export default class ChangeDurationCommand extends RebarCommand {
  constructor(duration) {
    super()
    this.newDuration = duration
  }

  storeForUndo() {
    super.storeForUndo()
    this.originalDuration = this.seq.selectedNote().duration
  }

  do() {
    this.seq.selectedNote().duration = this.newDuration
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.selectedNote().duration = this.originalDuration
  }
}