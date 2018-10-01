import Command from './Command'

export default class ToggleDotCommand extends Command {
  do() {
    this.seq.selectedNote().toggleDot()
    this.seq.rebar()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.toggleDotForSelected()
  }
}