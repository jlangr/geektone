import RebarCommand from './RebarCommand'
import Note from '../Note'

export class DuplicateNoteCommand extends RebarCommand {
  do() {
    const note = this.seq.selectedNote()
    const copy = new Note(note.name())
    copy.duration = note.duration
    copy.isNote = note.isNote
    this.seq.notes.splice(this.seq.currentNoteSequenceIndex + 1, 0, copy)
    this.seq.selectNext()

    this.duplicatedNoteIndex = this.seq.currentNoteSequenceIndex
  }

  undo() {
    this.seq.notes.splice(this.duplicatedNoteIndex, 1)
    this.seq.select(this.noteIndex)
  }
}