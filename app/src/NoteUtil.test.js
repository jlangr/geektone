import { applyAccidentals, noteObjects } from './NoteUtil'
import Note from './Note'

describe('noteObjects', () => {
  it('creates note objects with time transports', () => {
    const notes = [ new Note('C4', '8n'), new Note('D4', '4n')]
    const sharps = ['C4']

    expect(noteObjects(notes, sharps)).toEqual([
      { name: 'C#4', duration: '8n', time: '0:0:0'},
      { name: 'D4', duration: '4n', time: '0:0:2'}
    ])
  })

  it('includes flats', () => {
    const notes = [ new Note('C4', '8n'), new Note('D4', '4n'), new Note('E4')]
    const flats = ['D4']
    const sharps = ['E4']

    expect(noteObjects(notes, sharps, flats)).toEqual([
      { name: 'C4', duration: '8n', time: '0:0:0'},
      { name: 'Db4', duration: '4n', time: '0:0:2'},
      { name: 'E#4', duration: '4n', time: '0:1:2'},
    ])
  })

  it('ignores rests', () => {
    const notes = [ new Note('C4', '8n'), Note.Rest('4n'), new Note('D4', '4n')]

    expect(noteObjects(notes)).toEqual([
      { name: 'C4', duration: '8n', time: '0:0:0'},
      { name: 'D4', duration: '4n', time: '0:1:2'}
    ])
  })
})

describe('apply accidentals', () => {
  it('does nothing if no accidentals', () => {
    expect(applyAccidentals('F5', [])).toEqual('F5')
  })

  it('adds sharp if needed', () => {
    expect(applyAccidentals('F5', ['F5'])).toEqual('F#5')
  })

  it('adds flat if needed', () => {
    expect(applyAccidentals('E4', ['F5'], ['E4'])).toEqual('Eb4')
  })

  it('applies sharp if ambiguous (flat also supplied)', () => {
    expect(applyAccidentals('E4', ['E4'], ['E4'])).toEqual('E#4')
  })

  // TODO flats / sharps should be note base
  xit('applies sharp regardless of octave', () => {
    expect(applyAccidentals('E4', ['E5'])).toEqual('E#4')
  })
})