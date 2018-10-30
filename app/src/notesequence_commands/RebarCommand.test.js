import NoteSequence from '../NoteSequence'
import RebarCommand from './RebarCommand'
import Commander from '../Commander';

class SomeCommand extends RebarCommand {
  do() {}
  undo() {}
}

describe('any rebar derivate command', () => {
  let sequence
  let rebar
  let existingRebar

  beforeEach(() => {
    existingRebar = NoteSequence.prototype.rebar
    sequence = new NoteSequence()
    rebar = jest.fn()
    NoteSequence.prototype.rebar = rebar
  })

  afterEach(() => {
    NoteSequence.prototype.rebar = existingRebar
  })

  it('calls rebar when command executed', () => {
    const commander = new Commander(sequence)

    commander.execute(new SomeCommand())

    expect(rebar).toHaveBeenCalled()
  })
})
