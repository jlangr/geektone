class Command {
  constructor(noteSequence) {
    this.seq = noteSequence
    this.storeForUndo()
  }

  storeForUndo() {
    this.noteIndex = this.seq.currentNoteSequenceIndex
  }
}

export default Command