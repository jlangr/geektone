import Command from './Command'

export class ToggleAccidentalCommand extends Command {
  constructor(accidental) {
    super()
    this.accidental = accidental
  }

  toggle() {
    const note = this.seq.selectedNote()
    note.toggleAccidental(this.accidental)
  }

  do() {
    this.toggle()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.toggle()
  }
}