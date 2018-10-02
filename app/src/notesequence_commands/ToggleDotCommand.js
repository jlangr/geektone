import RebarCommand from './RebarCommand'

export class ToggleDotCommand extends RebarCommand {
  do() {
    this.seq.selectedNote().toggleDot()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.toggleDotForSelected()
  }
}