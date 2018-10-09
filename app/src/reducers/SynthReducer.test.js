import * as type from '../actions/types'
import * as actions from '../actions/SynthActions'
import SynthReducer, { INITIAL_STATE, showPlayButton } from './SynthReducer'
import * as toneutils from '../ToneUtils'

describe('add synth', () => {
  it('updates instrument-to-synth object', () => {
    const synth = 'flugelhornSynth'

    const state = SynthReducer(
      { synths: { 'x': 'y' }, expectedSynthCount: 2 },
      actions.addSynthAction('flugelhorn', synth));

    expect(state).toEqual({
      synths: { 'x': 'y', 'flugelhorn': 'flugelhornSynth' },
      expectedSynthCount: 2
    });
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
    {name: 't1', notes: [{name: 'E4'}, {name: 'F4'}]}
  ]}

  beforeEach(() => { 
    toneutils.play = jest.fn()
  })

  afterEach(() => {
    toneutils.play = play
  })

  it('turns on playing flag', () => {
    const state = SynthReducer(undefined, actions.playSong(song));

    expect(state.isPlaying).toBeTruthy()
  })

  it('tells toneutils to play the song', () => {
    SynthReducer(undefined, actions.playSong(song));

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
    const state = SynthReducer(undefined, actions.stopSong());

    expect(state.isPlaying).toBeFalsy()
  })

  it('tells toneutils to stop the song', () => {
    SynthReducer(undefined, actions.stopSong());

    expect(toneutils.stop).toHaveBeenCalled()
  })
})