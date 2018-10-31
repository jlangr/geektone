import { applyAccidentals, noteBase, noteObjects, octave } from './NoteUtil'
import Note from './Note'
import * as Duration from './Duration'

describe('noteBase', () => {
  it('is first part of note', () => expect(noteBase('E4')).toEqual('E'))

  it('works with sharps', () => expect(noteBase('E#4')).toEqual('E'))
})

describe('octave', () => {
  it('is last part of note', () => expect(octave('E4')).toEqual('4'))

  it('works with sharps', () => expect(octave('E#3')).toEqual('3'))
})

describe('noteObjects', () => {
  it('creates note objects with time transports', () => {
    const notes = [ new Note('C4', Duration.eighth), new Note('D4', Duration.quarter)]
    const sharps = ['C4'] 
    expect(noteObjects(notes, sharps)).toEqual([
      { name: 'C#4', duration: Duration.eighth, time: '0:0:0'},
      { name: 'D4', duration: Duration.quarter, time: '0:0:2'}
    ])
  })

  it('includes flats', () => {
    const notes = [ new Note('C4', Duration.eighth), new Note('D4', Duration.quarter), new Note('E4')]
    const flats = ['D4']
    const sharps = ['E4']

    expect(noteObjects(notes, sharps, flats)).toEqual([
      { name: 'C4', duration: Duration.eighth, time: '0:0:0'},
      { name: 'Db4', duration: Duration.quarter, time: '0:0:2'},
      { name: 'E#4', duration: Duration.quarter, time: '0:1:2'},
    ])
  })

  it('ignores rests', () => {
    const notes = [ new Note('C4', Duration.eighth), Note.Rest(Duration.quarter), new Note('D4', Duration.quarter)]

    expect(noteObjects(notes)).toEqual([
      { name: 'C4', duration: Duration.eighth, time: '0:0:0'},
      { name: 'D4', duration: Duration.quarter, time: '0:1:2'}
    ])
  })
})

describe('apply accidentals', () => {
  it('does nothing if no accidentals', () => {
    expect(applyAccidentals(new Note('F5'), [])).toEqual('F5')
  })

  it('adds sharp if needed', () => {
    expect(applyAccidentals(new Note('F5'), ['F'])).toEqual('F#5')
  })

  it('adds flat if needed', () => {
    expect(applyAccidentals(new Note('E4'), ['F'], ['E'])).toEqual('Eb4')
  })

  it('applies sharp if ambiguous (flat also supplied)', () => {
    expect(applyAccidentals(new Note('E4'), ['E'], ['E'])).toEqual('E#4')
  })

  it('applies sharp regardless of octave', () => {
    expect(applyAccidentals(new Note('E4'), ['E'])).toEqual('E#4')
  })

  it('overrides key signature accidental', () => {
    const note = new Note('C4')
    note.toggleAccidental('#')
    const flats = ['C4']

    const noteName = applyAccidentals(note, [], flats)

    expect(noteName).toEqual('C#4')
  })

  it('overrides key signature with natural', () => {
    const note = new Note('C4')
    note.toggleAccidental('n')
    const sharps = ['C4']

    const noteName = applyAccidentals(note, sharps, [])

    expect(noteName).toEqual('C4')
  })
})