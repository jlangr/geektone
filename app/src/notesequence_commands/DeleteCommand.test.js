import NoteSequence from '../NoteSequence'

describe('delete note', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4', '4n'], ['F4', '8n'], ['G4', '16n']])
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

  it('can be undone', () => {
    sequence.select(0)
    sequence.deleteSelected()

    sequence.undo()

    const notes = sequence.allNotes().map(note => {
      return [note.name(), note.duration]
    }
    );

    expect(notes).toEqual([['E4', '4n'], ['F4', '8n'], ['G4', '16n']])
  })
})