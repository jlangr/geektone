import NoteSequence from '../NoteSequence'
import * as Duration from '../Duration'

describe('toggle accidental for selected', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4']])
  })

  it('does nothing when note not selected', () => {
    sequence.toggleAccidentalForSelected('#')

    expect(sequence.firstNote().accidental).toEqual('')
  })

  describe('with first note selected', () => {
    beforeEach(() => {
      sequence = new NoteSequence([['E4']])
      sequence.selectFirst()
    })

    it('turns on the accidental for the selected note', () => {
      sequence.toggleAccidentalForSelected('b')

      expect(sequence.firstNote().accidental).toEqual('b')
    })

    it('turns off the accidental for the selected note', () => {
      sequence.toggleAccidentalForSelected('b')
      sequence.toggleAccidentalForSelected('b')

      expect(sequence.firstNote().accidental).toEqual('')
    })

    it('can be undone', () => {
      sequence.toggleAccidentalForSelected('n')

      sequence.undo()

      expect(sequence.firstNote().accidental).toEqual('')
    })
  })
})
