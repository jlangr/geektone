import Commander from './Commander'
import NoteSequence from './NoteSequence'
import Command from './notesequence_commands/Command'

class IncrementCommand extends Command {
  do() { this.seq.count = this.seq.count + 1 }
  executeUndo() { this.seq.count = this.seq.count - 1 }
}

class DoubleCommand extends Command {
  do() { this.seq.count = this.seq.count * 2 }
  executeUndo() { this.seq.count = this.seq.count / 2 }
}

class MagUpCommand extends Command {
  do() { this.seq.count = this.seq.count * 10 }
  executeUndo() { this.seq.count = this.seq.count / 10 }
}

describe('the commander', () => {
  const noteSequence = new NoteSequence()
  let commander = new Commander(noteSequence)
  const incrementCountCommand = new IncrementCommand()
  const doubleCountCommand = new DoubleCommand()
  const magUpCommand = new MagUpCommand()

  beforeEach(() => {
    commander = new Commander(noteSequence)
  })

  describe('execute', () => {
    it('runs the do function of the command', () => {
      noteSequence.count = 0

      commander.execute(incrementCountCommand)

      expect(noteSequence.count).toEqual(1)
    })
  })

  describe('executeUndo', () => {
    it('runs the undo function of the command', () => {
      noteSequence.count = 0
      commander.execute(incrementCountCommand)

      commander.executeUndo()

      expect(noteSequence.count).toEqual(0)
    })

    it('supports multiple undos', () => {
      noteSequence.count = 0
      commander.execute(incrementCountCommand)
      commander.execute(incrementCountCommand)
      commander.execute(doubleCountCommand)
      expect(noteSequence.count).toEqual(4)

      commander.executeUndo()
      commander.executeUndo()
      commander.executeUndo()

      expect(noteSequence.count).toEqual(0)
    })

    it('ignores extra undos', () => {
      noteSequence.count = 0

      commander.executeUndo()

      expect(noteSequence.count).toEqual(0)
    })
  })

  describe('redo', () => {
    beforeEach(() => {
      noteSequence.count = 0
      commander.execute(incrementCountCommand)
      commander.execute(magUpCommand)
      expect(noteSequence.count).toEqual(10)
    })

    it('redos an undone command', () => {
      commander.executeUndo()
      expect(noteSequence.count).toEqual(1)

      commander.executeRedo()

      expect(noteSequence.count).toEqual(10)
    })

    it('undos a redone command', () => {
      commander.executeUndo()
      commander.executeRedo()
      expect(noteSequence.count).toEqual(10)

      commander.executeUndo()

      expect(noteSequence.count).toEqual(1)
    })

    it('handles multiple undos and redos', () => {
      commander.execute(magUpCommand)
      expect(noteSequence.count).toEqual(100)

      commander.executeUndo()
      commander.executeUndo()
      commander.executeRedo()
      commander.executeRedo()

      expect(noteSequence.count).toEqual(100)
    })

    it('ignores excess redos', () => {
      commander.executeRedo()

      expect(noteSequence.count).toEqual(10)
    })
  })

})