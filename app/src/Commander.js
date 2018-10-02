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

  executeUndo() {
    const command = this.commands.pop()
    command.executeUndo()
  }
}