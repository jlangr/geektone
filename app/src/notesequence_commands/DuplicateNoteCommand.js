import Command from './Command'
import Note from '../Note'

class DuplicateNoteCommand extends Command {
  do() {
    this.storeForUndo()

    const note = this.seq.selectedNote()
    const copy = new Note(note.name())
    copy.duration = note.duration
    this.seq.notes.splice(this.seq.currentNoteSequenceIndex + 1, 0, copy)
    this.seq.selectNext()
    this.seq.rebar()
  }

  storeForUndo() {
    this.noteIndex = this.seq.currentNoteSequenceIndex
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.deleteSelected()
    this.seq.rebar()
  }
}

export default DuplicateNoteCommand