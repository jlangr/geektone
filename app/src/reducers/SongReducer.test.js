import * as actions from '../actions/SongActions'
import * as type from '../actions/types'
import SongReducer, { defaultTrackVolume, hasTrebleNotes, hasBassNotes, isInFlatsMode, isInSharpsMode, trackData } from './SongReducer'
import NoteSequence from '../NoteSequence'

describe('a song', () => {
  describe('create song', () => {
    it('assigns generated id', () => {
      const state = SongReducer({ song: { name: 'new' }}, actions.createSong('42', 'hey'))

      expect(state.song.id).toEqual('42')
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
      expect(SongReducer(undefined, 'whatever').song.isDirty).toBeFalsy()
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
    // TODO: it('is not dirty after undo to origin', () => { })
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
        {name: 'F4', duration: '8n'}]}
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

  it('allows changing the BPM', () => {
    const state = { song: { bpm: 120 }}

    const newState = SongReducer(state, actions.changeBpm(140))

    expect(newState.song.bpm).toEqual(140)
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

    expect(state.song.tracks.length).toEqual(0);
  })

  it('changes track instrument', () => {
    const state = { song: { tracks: [{instrument: 'piano'}]}}

    const newState = SongReducer(state, actions.changeTrackInstrument('cornet', 0))

    expect(newState.song.tracks[0].instrument).toEqual('cornet')
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

      it('toggles off when on', () => {
        const state = { song: { name: 'x', tracks: [{name: 'x', sharpsMode: true}, {name: 'y', sharpsMode: false}]}}

        const newState = SongReducer(state, actions.toggleSharpsMode(0))

        expect(newState.song.tracks[0].sharpsMode).toBeFalsy()
      })
    })

    describe('toggle flats mode', () => {
      it('turns on with first toggle', () => {
        const state = { song: { name: 'x', tracks: [{name: 'x', flatsMode: false}, {name: 'y', flatsMode: false}]}}

        const newState = SongReducer(state, actions.toggleFlatsMode(1))

        expect(newState.song.tracks[1].flatsMode).toBeTruthy()
      })

      it('toggles off when on', () => {
        const state = { song: { name: 'x', tracks: [{name: 'x', flatsMode: true}, {name: 'y', flatsMode: false}]}}

        const newState = SongReducer(state, actions.toggleFlatsMode(0))

        expect(newState.song.tracks[0].flatsMode).toBeFalsy()
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
  it('does when any note is C4 or higher', () => {
    const song = { tracks: [{ id: 0, notes: new NoteSequence(['C4', 'D4', 'E4']) }] }
    expect(hasTrebleNotes(song, 0)).toBeTruthy()
  })
})

describe('answers whether or not track has notes in bass staff', () => {
  it('does when any note is C4 or lower', () => {
    const song = { tracks: [{ id: 0, notes: new NoteSequence(['C4', 'D4', 'E4']) }] }
    expect(hasBassNotes(song, 0)).toBeFalsy()
  })
})