import Command from './Command'

export class ToggleRestCommand extends Command {
  do() {
    this.seq.selectedNote().restToggle()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.selectedNote().restToggle()
  }
}
