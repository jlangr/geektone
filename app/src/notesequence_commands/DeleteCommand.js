import RebarCommand from './RebarCommand'

export class DeleteCommand extends RebarCommand {
  storeForUndo() {
    super.storeForUndo()
    this.deletedNote = this.seq.selectedNote()
  }

  // TODO move delete logic to NoteSequence
  do() {
    this.seq.notes.splice(this.seq.currentNoteSequenceIndex, 1)
    this.seq.currentNoteSequenceIndex = Math.min(this.seq.length() - 1, this.seq.currentNoteSequenceIndex)
    this.seq.select(this.seq.currentNoteSequenceIndex)
  }

  undo() {
    this.seq.deselect() // remove select before array is altered
    this.seq.notes.splice(this.noteIndex, 0, this.deletedNote)
    this.seq.select(this.noteIndex)
  }
}