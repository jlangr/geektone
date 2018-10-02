import NoteSequence from '../NoteSequence'
import * as Duration from '../Duration'

describe('ChangeDurationCommand', () => {
  let sequenceWithOneQuarterNote

  beforeEach(() => {
    sequenceWithOneQuarterNote = new NoteSequence([['E4', Duration.quarter]])
  })

  it('updates duration', () => {
    sequenceWithOneQuarterNote.selectFirst()

    sequenceWithOneQuarterNote.setSelectedTo(Duration.half)

    expect(sequenceWithOneQuarterNote.selectedNote().duration).toEqual(Duration.half)
  })

  it('can be undone', () => {
    sequenceWithOneQuarterNote.selectFirst()
    sequenceWithOneQuarterNote.setSelectedTo(Duration.half)

    sequenceWithOneQuarterNote.undo()

    expect(sequenceWithOneQuarterNote.selectedNote().duration).toEqual(Duration.quarter)
  })
})
