import * as actions from '../actions/SynthActions'
import SynthReducer, { INITIAL_STATE, showPlayButton, startNoteIndices } from './SynthReducer'
import * as toneutils from '../ToneUtils'
import { NullLine } from '../ui/Line'
import NoteSequence from '../NoteSequence'
import Note from '../Note'
import * as Draw from '../util/Draw'

describe('add synth', () => {
  it('updates instrument-to-synth object', () => {
    const synth = 'flugelhornSynth'

    const state = SynthReducer(
      { synths: { 'x': 'y' }, expectedSynthCount: 2 },
      actions.addSynthAction('flugelhorn', synth))

    expect(state).toEqual({
      synths: { 'x': 'y', 'flugelhorn': 'flugelhornSynth' },
      expectedSynthCount: 2
    })
  })
})

describe('startNoteIndices', () => {
  it('maps to zeros for all tracks if no selectionStartLine start', () => {
    const song = { tracks: [{}, {}] }
    expect(startNoteIndices(song, {start: undefined })).toEqual([0, 0])
  })

  it('maps to starting index for songs with notes', () => {
    const note0 = new Note('F2')
    note0.position = 0
    const note1 = new Note('G2')
    note1.position = 1 
    const note2 = new Note('A2')
    note2.position = 2
    const notes = new NoteSequence()
    notes.addAll(note0, note1, note2)
    
    const song = { tracks: [{ notes }] }

    const indices = startNoteIndices(song, { start: { x: Draw.x(1) - 1 }})

    expect(indices).toEqual([1])
  })
})

describe('showPlayButton', () => {
  const state = INITIAL_STATE
  it('returns false when synths are not loaded and synth is not playing', () => {
    expect(showPlayButton(state)).toBeFalsy()
  })

  const loadAllSynths = state => [...Array(state.expectedSynthCount)].forEach((_, i) => state.synths[i] = i)

  it('returns false when synths are loaded but synth is playing', () => {
    state.isPlaying = true
    loadAllSynths(state)
    expect(showPlayButton(state)).toBeFalsy()
  })

  it('returns true when synths are loaded and synth is not playing', () => {
    state.isPlaying = true
    loadAllSynths(state)
    expect(showPlayButton(state)).toBeFalsy()
  })
})

describe('play song', () => {
  let play = toneutils.play
  const song = {name: 'new song', instrument: 'piano', tracks: [
    {name: 't1', notes: new NoteSequence(['E4', 'F4'])}
  ]}

  beforeEach(() => { 
    toneutils.play = jest.fn()
  })

  afterEach(() => {
    toneutils.play = play
  })

  it('turns on playing flag', () => {
    const state = SynthReducer(undefined, actions.playSong(song, () => {}, new NullLine()))

    expect(state.isPlaying).toBeTruthy()
  })

  it('tells toneutils to play the song', () => {
    SynthReducer(undefined, actions.playSong(song, () => {}, new NullLine()))

    expect(toneutils.play).toHaveBeenCalled()
  })
})

describe('stop song', () => {
  let stop = toneutils.stop

  beforeEach(() => { 
    toneutils.stop = jest.fn()
  })

  afterEach(() => {
    toneutils.stop = stop
  })

  it('turns on playing flag', () => {
    const state = SynthReducer(undefined, actions.stopSong())

    expect(state.isPlaying).toBeFalsy()
  })

  it('tells toneutils to stop the song', () => {
    SynthReducer(undefined, actions.stopSong())

    expect(toneutils.stop).toHaveBeenCalled()
  })
})