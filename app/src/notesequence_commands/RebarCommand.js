import Command from './Command'

export default class RebarCommand extends Command {
  execute() {
    super.execute()
    this.seq.rebar()
  }

  undo() {
    this.undo()
    this.seq.rebar()
  }
}