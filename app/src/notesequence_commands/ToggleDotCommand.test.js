import NoteSequence from '../NoteSequence'
import * as Duration from '../Duration'

describe('toggleDotForSelected', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4', Duration.quarter], ['F4', Duration.eighth], ['G4', Duration.sixteenth]])
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
      sequence.firstNote().duration = Duration.eighth

      sequence.toggleDotForSelected()

      expect(sequence.firstNote().duration).toEqual('0:0:3')
    })

    it('turns off the dot for the selected note', () => {
      sequence.firstNote().duration = '0:0:3'

      sequence.toggleDotForSelected()

      expect(sequence.firstNote().duration).toEqual(Duration.eighth)
    })

    it('can be undone', () => {
      sequence.firstNote().duration = '0:0:3'
      sequence.toggleDotForSelected()

      sequence.undo()

      expect(sequence.firstNote().duration).toEqual('0:0:3')
    })
  })
})