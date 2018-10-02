import RebarCommand from './RebarCommand'
import Note from '../Note'

export default class DuplicateNoteCommand extends RebarCommand {
  do() {
    const note = this.seq.selectedNote()
    const copy = new Note(note.name())
    copy.duration = note.duration
    this.seq.notes.splice(this.seq.currentNoteSequenceIndex + 1, 0, copy)
    this.seq.selectNext()
    this.seq.rebar()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.deleteSelected()
    this.seq.rebar()
  }
}