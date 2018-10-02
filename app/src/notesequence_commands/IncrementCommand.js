import Command from './Command'

export class IncrementCommand extends Command {
  do() {
    this.seq.selectedNote().increment()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.selectedNote().decrement()
  }
}
