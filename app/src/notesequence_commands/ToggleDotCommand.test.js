import ToggleDotCommand from './ToggleDotCommand'
import NoteSequence from '../NoteSequence'

describe('toggleDotForSelected', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4', '4n'], ['F4', '8n'], ['G4', '16n']])
  })

  // TODO
  // it('does nothing when note not selected', () => {
  //   sequence.toggleDotForSelected()
  // })

  describe('with first note selected', () => {
    beforeEach(() => {
      sequence.selectFirst()
    })

    it('turns on the dot for the selected note', () => {
      sequence.firstNote().duration = '8n'

      sequence.toggleDotForSelected()

      expect(sequence.firstNote().duration).toEqual('8n.')
    })

    it('turns off the dot for the selected note', () => {
      sequence.firstNote().duration = '8n.'

      sequence.toggleDotForSelected()

      expect(sequence.firstNote().duration).toEqual('8n')
    })

    it('can be undone', () => {
      sequence.firstNote().duration = '8n.'
      sequence.toggleDotForSelected()

      sequence.undo()

      expect(sequence.firstNote().duration).toEqual('8n.')
    })
  })
})