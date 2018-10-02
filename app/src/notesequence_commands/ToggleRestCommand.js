import Command from './Command'

export default class ToggleRestCommand extends Command {
  do() {
    this.seq.selectedNote().restToggle()
  }

  undo() {
    this.seq.select(this.noteIndex)
    this.seq.selectedNote().restToggle()
  }
}
