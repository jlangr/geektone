import Command from './Command'

export default class RebarCommand extends Command {
  execute() {
    super.execute()
    this.seq.rebar()
  }

  executeUndo() {
    this.undo()
    this.seq.rebar()
  }
}