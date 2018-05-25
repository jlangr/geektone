import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actions from './SongActions';
import * as type from './types';

describe('async actions', () => {
  let mock;
  let dispatch;
  const song = { name: 'x' };

  beforeEach(() => {
    mock = new MockAdapter(axios);
    dispatch = jest.fn();
  });

  afterEach(() => {
    mock.restore();
  });

  describe('load song', () => {
    it('dispatches to replace song on successful retrieve', async () => {
      mock.onGet(actions.request('/song')).reply(200, song);

      await actions.loadSong()(dispatch);
      
      expect(dispatch).toHaveBeenCalledWith(actions.replaceSong(song));
    });

    it('dispatches to error message', async () => {
      mock.onGet(actions.request('/song')).reply(500, song);

      await actions.loadSong()(dispatch);
      
      expect(dispatch).toHaveBeenCalledWith({ type: type.ERROR, payload: 'unable to load song; Error: Request failed with status code 500' });
    });
  });

  describe('save song', () => {
    it('dispatches to replace song on successful retrieve', async () => {
      mock.onPost(actions.request('/song')).reply(200);

      await actions.saveSong()(dispatch);
      
      expect(dispatch).toHaveBeenCalledWith({ type: type.MESSAGE, payload: 'song saved' });
    });

    it('dispatches to error message', async () => {
      mock.onPost(actions.request('/song')).reply(500);

      await actions.saveSong()(dispatch);
      
      expect(dispatch).toHaveBeenCalledWith({ type: type.ERROR, payload: 'unable to save your song, sorry: Error: Request failed with status code 500' });
    });
  });
});
