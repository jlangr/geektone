import NoteSequence from '../NoteSequence'
import * as Duration from '../Duration'

describe('delete note', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4', Duration.quarter], ['F4', Duration.eighth], ['G4', Duration.sixteenth]])
  })

  it('removes the currently selected note', () => {
    sequence.select(1)
    sequence.deleteSelected()

    expect(sequence.allNoteNames()).toEqual(['E4', 'G4'])
  })

  it('does not remove the last remaining note', () => {
    sequence = new NoteSequence(['E4'])
    sequence.selectFirst()

    sequence.deleteSelected()
    
    expect(sequence.allNoteNames()).toEqual(['E4'])
  })

  it('selects next note', () => {
    sequence.select(1)
    sequence.deleteSelected()

    expect(sequence.isSelected(1)).toBeTruthy()
  })

  it('selects previous note if the last note is selected', () => {
    const lastIndex = sequence.length() - 1
    sequence.selectLast()
    sequence.deleteSelected()

    expect(sequence.isSelected(lastIndex - 1)).toBeTruthy()
  })

  describe('undo', () => {
    it('restores deleted note', () => {
      sequence.select(0)
      sequence.deleteSelected()

      sequence.undo()

      expect(sequence.allNotes().map(note => [note.name(), note.duration]))
        .toEqual([['E4', Duration.quarter], ['F4', Duration.eighth], ['G4', Duration.sixteenth]])
    })

    it('restores deleted note', () => {
      sequence.select(0)
      sequence.deleteSelected()

      sequence.undo()

      expect(sequence.selectedNote().name()).toEqual('E4')
    })
  })
})