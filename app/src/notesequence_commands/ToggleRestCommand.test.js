import NoteSequence from '../NoteSequence'
import * as Duration from '../Duration'
import Note from '../Note';

describe('toggle rest', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4', Duration.quarter]])
    sequence.selectFirst()
  })

  it('toggles from rest to note', () => {
    sequence.toggleRestForSelected()

    expect(sequence.selectedNote().isNote).toBeFalsy()
  })

  it('can be undone', () => {
    sequence.toggleRestForSelected()

    sequence.undo()

    expect(sequence.selectedNote().isNote).toBeTruthy()
  })
})