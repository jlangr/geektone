import Tone from 'tone';
import * as TimeUtil from './TimeUtil';

export const play = async (tracks, synths) => {
  if (Tone.context.state !== 'running')
      Tone.context.resume();

  const tracksAsNoteObjects = tracks.map(track => 
    TimeUtil.noteObjects(track.notes.allNotes())
  );

  tracksAsNoteObjects.forEach(trackNoteObjects => {
    new Tone.Part((time, note) => {
      synths[0].triggerAttackRelease(note.name, note.duration, time);
    }, trackNoteObjects).start();
  });

  Tone.Transport.bpm.value = 144;
  const slightDelayToAvoidSchedulingErrors = '+0.1';
  Tone.Transport.start(slightDelayToAvoidSchedulingErrors);
}

export const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
};