export default class Command {
  storeForUndo() {
    this.noteIndex = this.seq.currentNoteSequenceIndex
  }

  execute() {
    this.do()
  }

  executeUndo() {
    this.undo()
  }
}