import Command from './Command'

export default class RebarCommand extends Command {
  execute() {
    this.do()
    this.seq.rebar()
  }
}