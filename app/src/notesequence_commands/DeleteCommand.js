import RebarCommand from './RebarCommand'

export class DeleteCommand extends RebarCommand {
  storeForUndo() {
    super.storeForUndo()
    this.deletedNote = this.seq.selectedNote()
  }

  do() {
    this.seq.notes.splice(this.seq.currentNoteSequenceIndex, 1)
    this.seq.currentNoteSequenceIndex = Math.min(this.seq.length() - 1, this.seq.currentNoteSequenceIndex)
    this.seq.select(this.seq.currentNoteSequenceIndex)
  }

  undo() {
    this.seq.notes.splice(this.noteIndex, 0, this.deletedNote)
  }
}