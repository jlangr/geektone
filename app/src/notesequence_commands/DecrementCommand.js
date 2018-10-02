import Command from './Command'

export default class DecrementCommand extends Command {
  do() {
    this.seq.selectedNote().decrement()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.selectedNote().increment()
  }
}
