import NoteSequence from '../NoteSequence'

describe('duplicate note', () => {
  let sequence

  beforeEach(() => {
    sequence = new NoteSequence([['E4', '4n'], ['F4', '8n'], ['G4', '16n']])
  })

  it('can be undone', () => {
    sequence.selectFirst()
    sequence.duplicateNote()

    sequence.undo()

    expect(sequence.allNoteNames()).toEqual(['E4', 'F4', 'G4'])
  })

  it('introduces new note following selected', () => {
    sequence.selectFirst()

    sequence.duplicateNote()

    expect(sequence.allNoteNames()).toEqual(['E4', 'E4', 'F4', 'G4'])
  })

  it('duplicates rests', () => {
    sequence.note(0).duration = '16n'
    sequence.note(0).restToggle()
    sequence.select(0)

    sequence.duplicateNote()

    expect(sequence.note(1).isRest()).toBeTruthy()
  })

  it('includes duration', () => {
    sequence.note(0).duration = '16n'
    sequence.select(0)

    sequence.duplicateNote()

    expect(sequence.note(1).duration).toEqual('16n')
  })

  it('introduces new note following selected', () => {
    sequence.selectFirst()

    sequence.duplicateNote()

    const firstNote = sequence.note(0)
    const newNote = sequence.note(1)
    expect(firstNote.isSelected).toBeFalsy()
    expect(newNote.isSelected).toBeTruthy()
  })
})