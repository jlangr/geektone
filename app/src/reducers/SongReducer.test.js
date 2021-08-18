import * as actions from '../actions/SongActions'
import * as type from '../actions/types'
import SongReducer, {
  defaultTrackVolume,
  hasBassNotes,
  hasTrebleNotes,
  indexOfNoteAfter,
  INITIAL_STATE,
  isInFlatsMode,
  isInSharpsMode,
  isUniqueName,
  trackData
} from './SongReducer'
import NoteSequence from '../NoteSequence'
import Note from '../Note'
import * as Constants from '../Constants'
import * as Duration from '../Duration'

describe('a song', () => {
  describe('create song', () => {
    const state = SongReducer({ song: { name: 'default' }}, 
        actions.createSong('42', [['42', 'default']], 'some message' ))

    it('assigns generated id', () => {
      expect(state.song.id).toEqual('42')
    })

    it('saves message', () => {
      expect(state.message).toEqual('some message')
    })

    it('converts and stores song list', () => {
      expect(state.songList).toEqual([{value: '42', label: 'default'}])
    })
    
    it('marks song as clean', () => {
      expect(state.song.isDirty).toBeFalsy()
    })
  })

  describe('set volume', () => {
    const initialState = { song: { tracks: [{ }] } }

    it('does not update volume if unchanged', () => {
      initialState.song.tracks[0].volume = 5
      
      const state = SongReducer(initialState, actions.setVolume(0, 5))

      expect(state).toBe(initialState)
    })

    it('updates volume', () => {
      const state = SongReducer(initialState, actions.setVolume(0, 10))

      expect(state.song.tracks[0].volume).toEqual(10)
    })

    it('rounds', () => {
      const state = SongReducer(initialState, actions.setVolume(0, 5.442))

      expect(state.song.tracks[0].volume).toEqual(5)
    })

    it('minimizes at 1', () => {
      const state = SongReducer(initialState, actions.setVolume(0, 0.1052))

      expect(state.song.tracks[0].volume).toEqual(1)
    })

    it('fixes freak (defective) numbers', () => {
      const state = SongReducer(initialState, actions.setVolume(0, 51))

      expect(state.song.tracks[0].volume).toEqual(5)
    })
  })

  describe('is either dirty or not', () => {
    it('is not dirty by default', () => {
      const newState = SongReducer(undefined, 'whatever')
      expect(newState.song.isDirty).toBeFalsy()
    })

    it('is dirty after any update', () => {
      const state = SongReducer(undefined, actions.changeSongName('y', []))

      expect(state.song.isDirty).toBeTruthy()
    })

    it('is not dirty after a save', () => {
      const state = SongReducer({ song: { isDirty: true}}, actions.markClean('message'))

      expect(state.song.isDirty).toBeFalsy()
      expect(state.message).toEqual('message')
    })

    it('is not dirty after load (replace)', () => {
      const state = SongReducer({ song: { tracks: [] } }, actions.replaceSong({ tracks: [], isDirty: true }))

      expect(state.song.isDirty).toBeFalsy()
    })

    it('explicitly sets dirty flag to true', () => {
      const newState = SongReducer(undefined, actions.markDirty())

      expect(newState.song.isDirty).toBeTruthy()
    })
  })

  describe('manages UI messages', () => {
    it('holds a message', () => {
      const state = SongReducer(undefined, {type: type.MESSAGE, payload: 'a message'})

      expect(state.message).toEqual('a message')
    })

    it('clears message by default for other types', () => {
      const state = { message: 'something', song: {} }

      const newState = SongReducer(state, {type: 'whatever'})

      expect(newState.message).toEqual(undefined)
    })

    it('holds an error message', () => {
      const state = SongReducer(undefined, {type: type.ERROR, payload: 'a message'})

      expect(state.errorMessage).toEqual('a message')
    })

    it('clears message by default for other types', () => {
      const state = { errorMessage: 'something', song: {} }

      const newState = SongReducer(state, {type: 'whatever'})

      expect(newState.errorMessage).toEqual(undefined)
    })
  })

  describe('replace song', () => {
    const song = {name: 'new song', tracks: [
      {name: 'track1', notes: [
        {name: 'E4', duration: '4n', isNote: false}, 
        {name: 'F4', duration: '8n', isNote: true, accidental: '#'}]}
    ]}

    const state = SongReducer(undefined, actions.replaceSong(song))
    const noteSequence = state.song.tracks[0].notes

    it('restores basic note information', () => {
      expect(noteSequence.note(1).name()).toEqual('F4')
    })

    it('restores rest boolean', () => {
      expect(noteSequence.note(0).isNote).toBeFalsy()
    })

    it('defaults missing values', () => {
      expect(state.song.tracks[0].volume).toEqual(defaultTrackVolume)
    })

    it('restores accidental', () => {
      expect(noteSequence.note(1).accidental).toEqual('#')
    })
  })

  describe('changing the song name', () => {
    const serverSongList = [['42', 'new name']]
    const state = SongReducer(undefined, actions.changeSongName('new name', serverSongList))

    it('updates the name', () => {
      expect(state.song.name).toEqual('new name')
    })

    it('transforms the song list to the selection list expected format', () => {
      expect(state.songList).toEqual([{value: '42', label: 'new name'}])
    })
  })

  describe('changing the name of a new song', () => {
    const state = SongReducer({ song: { name: 'default'} }, actions.changeNewSongName('new name'))

    it('updates the name', () => {
      expect(state.song.name).toEqual('new name')
    })
  })

  it('allows changing the BPM', () => {
    const state = { song: { bpm: 120 }}

    const newState = SongReducer(state, actions.changeBpm(140))

    expect(newState.song.bpm).toEqual(140)
  })

  describe('creating a new song', () => {
    const newState = SongReducer({ song: { name: 'in progress' } }, actions.newSong())

    it('resets song to default', () => {
      expect(newState.song).toEqual(INITIAL_STATE.song)
    })
  })

  describe('removing a song', () => {
    const songList = [['42', 'default']]
    const newState = SongReducer({ song: { name: 'in progress' } }, actions.removeSong(songList))
    
    it('resets song to default', () => {
      expect(newState.song).toEqual(INITIAL_STATE.song)
    })

    it('updates the song list', () => {
      expect(newState.songList).toEqual([{value: '42', label: 'default'}])
    })
  })

  describe('creating a new track', () => {
    const state = SongReducer(undefined, actions.newTrack())

    it('is added to the song', () => {
      expect(state.song.tracks.length).toEqual(1)
    })

    it('has default values for name, instrument, and volume', () => {
      expect(state.song.tracks[0].name).toEqual('track1')
      expect(state.song.tracks[0].instrument).toEqual('piano')
      expect(state.song.tracks[0].volume).toEqual(7)
    })
  })

  it('deletes a track', () => {
    const state = SongReducer({ song: { tracks: [{name: 'x', id: 0}]}}, actions.deleteTrack(0))

    expect(state.song.tracks.length).toEqual(0)
  })

  it('changes track instrument', () => {
    const state = { song: { tracks: [{instrument: 'piano'}]}}

    const newState = SongReducer(state, actions.changeTrackInstrument('cornet', 0))

    expect(newState.song.tracks[0].instrument).toEqual('cornet')
  })
})

describe('toggle click insert mode', () => {
  it('turns on with first toggle', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x', isInClickInsertMode: false}]}}

    const newState = SongReducer(state, actions.toggleClickInsertMode(0))

    expect(newState.song.tracks[0].isInClickInsertMode).toBeTruthy()
  })

  it('toggles off when on', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x', isInClickInsertMode: true}]}}

    const newState = SongReducer(state, actions.toggleClickInsertMode(0))

    expect(newState.song.tracks[0].isInClickInsertMode).toBeFalsy()
  })
})

describe('toggle mute', () => {
  it('turns on with first toggle', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x', isMuted: false}]}}

    const newState = SongReducer(state, actions.toggleMute(0))

    expect(newState.song.tracks[0].isMuted).toBeTruthy()
  })

  it('toggles off when on', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x', isMuted: true}]}}

    const newState = SongReducer(state, actions.toggleMute(0))

    expect(newState.song.tracks[0].isMuted).toBeFalsy()
  })
})

describe('key signature sharps and flats', () => {
  describe('toggling mode', () => {
    describe('toggle sharps mode', () => {
      it('turns on with first toggle', () => {
        const state = { song: { name: 'x', tracks: [{name: 'x', sharpsMode: false}, {name: 'y', sharpsMode: false}]}}

        const newState = SongReducer(state, actions.toggleSharpsMode(1))

        expect(newState.song.tracks[1].sharpsMode).toBeTruthy()
      })
    })

    describe('toggle flats mode', () => {
      it('turns on with first toggle', () => {
        const state = { song: { name: 'x', tracks: [{name: 'x', flatsMode: false}, {name: 'y', flatsMode: false}]}}

        const newState = SongReducer(state, actions.toggleFlatsMode(1))

        expect(newState.song.tracks[1].flatsMode).toBeTruthy()
      })
    })
  })

  describe('is in flats mode?', () => {
    it('is true when flag is on for track', () => {
      const song = { tracks: [ { flatsMode: true } ]}

      expect(isInFlatsMode(song, 0)).toBeTruthy()
    })

    it('is false when flag is off for track', () => {
      const song = { tracks: [ { flatsMode: true }, { flatsMode: false } ]}

      expect(isInFlatsMode(song, 1)).toBeFalsy()
    })
  })

  describe('is in sharps mode?', () => {
    it('is true when flag is on for track', () => {
      const song = { tracks: [ { sharpsMode: true } ]}

      expect(isInSharpsMode(song, 0)).toBeTruthy()
    })

    it('is false when flag is off for track', () => {
      const song = { tracks: [ { sharpsMode: true }, { sharpsMode: false } ]}

      expect(isInSharpsMode(song, 1)).toBeFalsy()
    })
  })

  it('adds note to sharps', () => {
    const state = { song: { name: 'x', tracks: [{name: 'a', sharps: [], flats: []}]}}

    const newState = SongReducer(state, actions.addSharp(0, 'F4'))

    expect(newState.song.tracks[0].sharps).toEqual(['F4'])
  })

  it('ignores undefined', () => {
    const state = { song: { name: 'x', tracks: [{sharps: ['F4'], flats: [], name: 'a'}]}}

    const newState = SongReducer(state, actions.addSharp(0, undefined))

    expect(newState.song.tracks[0].sharps).toEqual(['F4'])
  })

  it('removes when already exists', () => {
    const state = { song: { name: 'x', tracks: [{sharps: ['F4'], flats: [], name: 'a'}]}}

    const newState = SongReducer(state, actions.addSharp(0, 'F4'))

    expect(newState.song.tracks[0].sharps).toEqual([])
  })

  describe('sharps and flats', () => {
    it('adds note to flats', () => {
      const state = { song: { name: 'x', tracks: [{name: 'a', flats: [], sharps: []}]}}

      const newState = SongReducer(state, actions.addFlat(0, 'F4'))

      expect(newState.song.tracks[0].flats).toEqual(['F4'])
    })

    it('changes flat to sharp when same note clicked', () => {
      const state = { song: { name: 'x', tracks: [{flats: ['F4'], sharps: ['G4'], name: 'a'}]}}

      const newState = SongReducer(state, actions.addSharp(0, 'F4'))

      expect(newState.song.tracks[0].sharps).toEqual(['G4', 'F4'])
      expect(newState.song.tracks[0].flats).toEqual([])
    })

    it('changes sharp to flat when same note clicked', () => {
      const state = { song: { name: 'x', tracks: [{flats: ['F4'], sharps: ['G4'], name: 'a'}]}}

      const newState = SongReducer(state, actions.addFlat(0, 'G4'))

      expect(newState.song.tracks[0].sharps).toEqual([])
      expect(newState.song.tracks[0].flats).toEqual(['F4', 'G4'])
    })
  })

  it('ignores undefined', () => {
    const state = { song: { name: 'x', tracks: [{flats: ['F4'], sharps: [], name: 'a'}]}}

    const newState = SongReducer(state, actions.addFlat(0, undefined))

    expect(newState.song.tracks[0].flats).toEqual(['F4'])
  })

  it('removes when already exists', () => {
    const state = { song: { name: 'x', tracks: [{flats: ['F4'], sharps: [], name: 'a'}]}}

    const newState = SongReducer(state, actions.addFlat(0, 'F4'))

    expect(newState.song.tracks[0].flats).toEqual([])
  })
})

describe('trackData', () => {
  it('represents the track given an id', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x'}, {name: 'y'}]}}

    const track = trackData(state, 1)

    expect(track).toEqual({name: 'y'})
  })
})

describe('answers whether or not track has notes in treble staff', () => {
  it('does when any note is middle C or higher', () => {
    const song = { tracks: [{ id: 0, notes: new NoteSequence([Constants.MiddleC, 'D4', 'E4']) }] }
    expect(hasTrebleNotes(song, 0)).toBeTruthy()
  })

  it('does not count rests', () => {
    const noteSequence = new NoteSequence()
    noteSequence.add(Note.Rest(Duration.quarter))

    const song = { tracks: [{ id: 0, notes: noteSequence }] }

    expect(hasTrebleNotes(song, 0)).toBeFalsy()
  })
})

describe('answers whether or not track has notes in bass staff', () => {
  it('does when at least one note is lower than A below middle', () => {
    const song = { tracks: [{ id: 0, notes: new NoteSequence(['E2']) }] }
    expect(hasBassNotes(song, 0)).toBeTruthy()
  })

  it('does not when no note is lower than A below middle', () => {
    const song = { tracks: [{ id: 0, notes: new NoteSequence([Constants.MiddleC, 'D4', 'E4']) }] }
    expect(hasBassNotes(song, 0)).toBeFalsy()
  })

  it('does not count rests', () => {
    const noteSequence = new NoteSequence()
    const note = new Note('F1', Duration.quarter, false)
    noteSequence.add(note)

    const song = { tracks: [{ id: 0, notes: noteSequence }] }

    expect(hasBassNotes(song, 0)).toBeFalsy()
  })
})

describe('isUniqueName', () => {
  const songList =  [
   {value: '1', label: 'alpha'},
   {value: '2', label: 'beta'}
  ];

  it('is true when song name is not changed', () => {
    expect(isUniqueName(songList, 'beta', 'beta')).toBeTruthy()
  })

  it('is true when no other song has same name', () => {
    expect(isUniqueName(songList, 'bozo', 'x')).toBeTruthy()
  })

  it('is false when another song has same name', () => {
    expect(isUniqueName(songList, 'alpha', 'x')).toBeFalsy()
  })
})

describe('index of note after', () => {
  const firstNote = new Note('E1')
  const secondNote = new Note('F1')
  const thirdNote = new Note('G1')
  let track
  let notes

  beforeEach(() => {
    notes = new NoteSequence()
    track = { notes }
    notes.add(firstNote)
    firstNote.setPosition(0)
    notes.add(secondNote)
    secondNote.setPosition(1)
    notes.add(thirdNote)
    thirdNote.setPosition(2)
  })

  it('returns 0 if clicked before first note', () => {
    expect(indexOfNoteAfter(track, 0)).toEqual(0)
  })

  it('returns last index if clicked before last note', () => {
    expect(indexOfNoteAfter(track, thirdNote.x() - 1)).toEqual(notes.length() - 1)
  })

  it('returns -1 if clicked after last note', () => {
    expect(indexOfNoteAfter(track, thirdNote.x() + 1)).toEqual(-1)
  })
})