export default class Command {
  storeForUndo() {
    this.noteIndex = this.seq.currentNoteSequenceIndex
  }
}