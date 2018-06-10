import * as type from '../actions/types';
import * as actions from '../actions/SongActions';
import SongReducer, { isInSharpsMode, trackData } from './SongReducer';
import NoteSequence from '../NoteSequence';

describe('song reducer', () => {
  it('replaces the song', () => {
    const song = {name: 'new song', tracks: [
      {name: 'track1', notes: [{name: 'E4', duration: '4n'}, {name: 'F4', duration: '8n'}]}
    ]};

    const state = SongReducer(undefined, actions.replaceSong(song));

    const noteSequence = state.song.tracks[0].notes;
    expect(noteSequence.note(1).name()).toEqual('F4');
  });

  it('allows changing the song name', () => {
    const state = SongReducer(undefined, actions.changeSongName('newName'));

    expect(state.song.name).toEqual('new name');
  });
  
  it('allows changing the BPM', () => {
    const state = { song: { bpm: 120 }};

    const newState = SongReducer(state, actions.changeBpm(140));

    expect(newState.song.bpm).toEqual(140);
  });

  it('adds a track', () => {
    const noteSequence = new NoteSequence(['A3']);
    const newTrack = { id: 'track2', name: 'track2', notes: noteSequence };

    const state = SongReducer(undefined, actions.addTrack(newTrack));

    expect(state.song.tracks.length).toEqual(1);
    expect(state.song.tracks[0].name).toEqual('track2');
  });

  it('changes track instrument', () => {
    const state = { song: { tracks: [{instrument: 'piano'}]}};

    const newState = SongReducer(state, actions.changeTrackInstrument('cornet', 0));

    expect(newState.song.tracks[0].instrument).toEqual('cornet');
  });
});

describe('toggle sharps mode', () => {
  it('turns on with first toggle', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x', sharpsMode: false}, {name: 'y', sharpsMode: false}]}};

    const newState = SongReducer(state, actions.toggleSharpsMode(1));

    expect(newState.song.tracks[1].sharpsMode).toBeTruthy();
  });

  it('toggles off when on', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x', sharpsMode: true}, {name: 'y', sharpsMode: false}]}};

    const newState = SongReducer(state, actions.toggleSharpsMode(0));

    expect(newState.song.tracks[1].sharpsMode).toBeFalsy();
  });
});

describe('toggle mute', () => {
  it('turns on with first toggle', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x', isMuted: false}]}};

    const newState = SongReducer(state, actions.toggleMute(0));

    expect(newState.song.tracks[0].isMuted).toBeTruthy();
  });

  it('toggles off when on', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x', isMuted: true}]}};

    const newState = SongReducer(state, actions.toggleMute(0));

    expect(newState.song.tracks[0].isMuted).toBeFalsy();
  });
});

describe('is in sharps mode?', () => {
  it('is true when flag is on for track', () => {
    const song = { tracks: [ { sharpsMode: true } ]};

    expect(isInSharpsMode(song, 0)).toBeTruthy();
  });

  it('is false when flag is off for track', () => {
    const song = { tracks: [ { sharpsMode: true }, { sharpsMode: false } ]};

    expect(isInSharpsMode(song, 1)).toBeFalsy();
  });
});

// TODO track ID should not be index of track

describe('trackData', () => {
  it('represents the track given an id', () => {
    const state = { song: { name: 'x', tracks: [{name: 'x'}, {name: 'y'}]}};

    const track = trackData(state, 1);

    expect(track).toEqual({name: 'y'});
  });
});

describe('add accidental', () => {
  it('adds note to sharps', () => {
    const state = { song: { name: 'x', tracks: [{name: 'a'}]}};

    const newState = SongReducer(state, actions.addSharp(0, 'F5'));

    expect(newState.song.tracks[0].sharps).toEqual(['F5']);
  });

  it('ignores undefined', () => {
    const state = { song: { name: 'x', tracks: [{sharps: ['F5'], name: 'a'}]}};

    const newState = SongReducer(state, actions.addSharp(0, undefined));

    expect(newState.song.tracks[0].sharps).toEqual(['F5']);
  });

  it('removes when already exists', () => {
    const state = { song: { name: 'x', tracks: [{sharps: ['F5'], name: 'a'}]}};

    const newState = SongReducer(state, actions.addSharp(0, 'F5'));

    expect(newState.song.tracks[0].sharps).toEqual([]);
  });
});