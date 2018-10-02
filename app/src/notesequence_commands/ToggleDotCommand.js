import RebarCommand from './RebarCommand'

export default class ToggleDotCommand extends RebarCommand {
  do() {
    this.seq.selectedNote().toggleDot()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.toggleDotForSelected()
  }
}