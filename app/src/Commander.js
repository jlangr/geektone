export default class Commander {
  constructor(noteSequence) {
    this.commands = []
    this.redoCommands = []
    this.seq = noteSequence
  }

  execute(command) {
    command.seq = this.seq
    command.storeForUndo()
    this.commands.push(command)
    command.execute()
  }

  executeUndo() {
    if (this.commands.length === 0) return

    const command = this.commands.pop()
    command.executeUndo()
    this.redoCommands.push(command)
  }

  executeRedo() {
    if (this.redoCommands.length === 0) return

    const command = this.redoCommands.pop()
    command.execute()
    this.commands.push(command)
  }
}