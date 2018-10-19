import { unmutedNoteObjects, updateSynthVolumes } from './ToneUtils'
import NoteSequence from './NoteSequence'

describe('updateSynthVolumes', () => {
  const tracks = [
    { instrument: 'mute', volume: 0 },
    { instrument: 'med', volume: 5 },
    { instrument: 'high', volume: 10 }]
  const synths = {
    ['mute']: { volume: { value: 1 }},
    ['med']: { volume: { value: 2 }},
    ['high']: { volume: { value: 3 }} }

  beforeEach(() => {
    updateSynthVolumes(tracks, synths)
  })

  it('sets dbs to -Infinity for mute value', () => {
    expect(synths['mute'].volume.value).toEqual(-Infinity)
  })

  it('sets dbs to -6 for mid value', () => {
    expect(Math.round(synths['med'].volume.value)).toEqual(-6)
  })

  it('sets dbs to 0 for high value', () => {
    expect(synths['high'].volume.value).toEqual(0)
  })
})

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