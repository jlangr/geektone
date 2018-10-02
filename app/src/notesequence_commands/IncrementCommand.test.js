import NoteSequence from '../NoteSequence'

describe('increment', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4']])
    sequence.selectFirst()
  })

  it('increments selected', () => {
    sequence.incrementSelected()

    expect(sequence.selectedNote().name()).toEqual('F4')
  })

  it('can be undone', () => {
    sequence.incrementSelected()

    sequence.undo()

    expect(sequence.selectedNote().name()).toEqual('E4')
  })
})