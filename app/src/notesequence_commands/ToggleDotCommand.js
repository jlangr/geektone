import Command from './Command'

class ToggleDotCommand extends Command {
  do() {
    this.storeForUndo()

    this.seq.selectedNote().toggleDot()
    this.seq.rebar()
  }

  storeForUndo() {
    this.noteIndex = this.seq.currentNoteSequenceIndex
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.toggleDotForSelected()
  }
}

export default ToggleDotCommand