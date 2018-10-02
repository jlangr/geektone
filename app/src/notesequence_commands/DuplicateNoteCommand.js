import RebarCommand from './RebarCommand'
import DeleteCommand from './DeleteCommand'
import Note from '../Note'

export default class DuplicateNoteCommand extends RebarCommand {
  do() {
    const note = this.seq.selectedNote()
    const copy = new Note(note.name())
    copy.duration = note.duration
    this.seq.notes.splice(this.seq.currentNoteSequenceIndex + 1, 0, copy)
    this.seq.selectNext()
  }

  undo() {
    this.seq.select(this.noteIndex)

    const deleteCommand = new DeleteCommand()
    deleteCommand.seq = this.seq
    deleteCommand.do()
  }
}