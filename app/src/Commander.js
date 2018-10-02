export default class Commander {
  constructor(noteSequence) {
    this.commands = []
    this.seq = noteSequence
  }

  execute(command) {
    command.seq = this.seq
    command.storeForUndo()
    this.commands.push(command)
    command.execute()
  }

  undo() {
    const command = this.commands[this.commands.length - 1]
    command.undo()
    this.commands.pop()
  }
}