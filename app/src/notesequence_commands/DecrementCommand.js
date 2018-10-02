import Command from './Command'

export class DecrementCommand extends Command {
  do() {
    this.seq.selectedNote().decrement()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.selectedNote().increment()
  }
}
