import { unmutedNoteObjects } from './ToneUtils'
import NoteSequence from './NoteSequence'

describe('unmutedNoteObjects', () => {
  const notes1 = new NoteSequence(['E4', 'F4'])
  const notes2 = new NoteSequence(['D3', 'E3'])
  const tracks = [
    {name: 'unmuted', notes: notes1 },
    {name: 'muted', isMuted: true, notes: notes2}
  ]

  let result

  beforeEach(() => {
    result = unmutedNoteObjects(tracks)
  })

  it('removes muted tracks', () => {
    const names = result.map(([track, _]) => track.name)
    expect(names).toEqual(['unmuted'])
  })

  it('converts notes to note objects', () => {
    const noteObjects = result.map(([_, noteObjects]) => noteObjects)[0]
    expect(noteObjects).toEqual([
      {"duration": "4n", "name": "E4", "time": "0:0:0"}, 
      {"duration": "4n", "name": "F4", "time": "0:1:0"}])
  })
})