import Tone from 'tone';
import * as type from './types';

const sampleNotes = {
  'violin': ['C#1', 'D#1', 'F1', 'G1', 'A1', 'B1', 'C#2', 'D#2', 'F2', 'G2', 'A2', 'C#3', 'D#3', 'F3', 'G3', 'A3', 'B3', 'C#4', 'D#4', 'G4'],
  'piano': ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A#0', 'A#1', 'A#2', 'A#3', 'A#4', 'A#5', 'A#6', 
    'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 
    'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C#0', 'C#1', 'C#2', 'C#3', 'C#4', 'C#5', 'C#6', 
    'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D#0', 'D#1', 'D#2', 'D#3', 'D#4', 'D#5', 'D#6',
    'E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6',
    'F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F#0', 'F#1', 'F#2', 'F#3', 'F#4', 'F#5', 'F#6',
    'G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G#0', 'G#1', 'G#2', 'G#3', 'G#4', 'G#5', 'G#6' ],
  'bass-electric': ['A#2', 'A#3', 'A#4', 'A#5', 'C#2', 'C#3', 'C#4', 'C#5', 'C#6', 'E2', 'E3', 'E4', 'E5', 'G2', 'G3', 'G4', 'G5'],
  'bassoon': ['A1', 'A2', 'A3', 'C2', 'C3', 'C4', 'E3', 'G1', 'G2', 'G3'],
  'cello': ['A2', 'A3', 'A4', 'A2', 'A3', 'A4', 'B2', 'B3', 'B4', 'C2', 'C3', 'C4', 'C5', 'C3', 'C4', 'D2', 'D3', 'D4', 'E2', 'E3', 'E4', 'F2', 'F3', 'F4', 'G2', 'G3', 'G4'],
  'electric-guitar': ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1', 'E2', 'E3', 'E4', 'F1', 'F2', 'F3', 'G1', 'G2', 'G3'],
  'french-horn': ['A0', 'A2', 'C1', 'C3', 'D2', 'D4', 'D#1', 'F2', 'F4', 'G1'],
  'organ': ['A1', 'A2', 'A3', 'A4', 'A5', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'D#1', 'D#2', 'D#3', 'D#4', 'D#5', 'F#1', 'F#2', 'F#3', 'F#4', 'F#5'],
  'trumpet': ['A2', 'A4', 'A#3', 'C3', 'C5', 'D4', 'D#3', 'F2', 'F3', 'F4', 'G3']
}

const noteToFileMapping = (instrument) => {
  const filename = noteName => `${noteName.replace('#', 's')}.mp3`;
  var noteToFile = {};
  sampleNotes[instrument].forEach((noteName, i) => noteToFile[noteName] = filename(noteName)); // could use lodash
  return noteToFile;
}

const createSynth = (instrument, dispatch) => {
  const mappings = noteToFileMapping(instrument) 
  const config = {
    'release' : 1, 
    'baseUrl' : `./samples/${instrument}/`,
    'onload': buffers => dispatch(addSynthAction(instrument, synth))};
  var synth = new Tone.Sampler(mappings, config).toMaster()
}

export const addSynthAction = (instrument, synth) => ( { type: type.ADD_SYNTH, payload: { instrument, synth } } );;

export const loadSynths = () => {
  return function(dispatch) {
    createSynth('piano', dispatch);
    createSynth('violin', dispatch);
    createSynth('bass-electric', dispatch);
    createSynth('bassoon', dispatch);
    createSynth('cello', dispatch);
    createSynth('electric-guitar', dispatch);
    createSynth('french-horn', dispatch);
    createSynth('organ', dispatch);
    createSynth('trumpet', dispatch);
  };
};