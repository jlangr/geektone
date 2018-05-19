import * as type from './types';

export const replaceSong = song => ({ type: type.REPLACE_SONG, payload: song });
