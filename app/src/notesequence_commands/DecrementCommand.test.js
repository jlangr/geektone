import NoteSequence from '../NoteSequence'

describe('decrement', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4']])
    sequence.selectFirst()
  })

  it('decrements selected', () => {
    sequence.decrementSelected()

    expect(sequence.selectedNote().name()).toEqual('D4')
  })

  it('can be undone', () => {
    sequence.decrementSelected()

    sequence.undo()

    expect(sequence.selectedNote().name()).toEqual('E4')
  })
})