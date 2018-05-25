import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actions from './SongActions';
import * as type from './types';

describe('load song', () => {
  let mock;
  let dispatch;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    dispatch = jest.fn();
  });

  afterEach(() => {
    mock.restore();
  });

  it('dispatches to replace song on successful retrieve', async () => {
    const song = { name: 'x' };
    mock.onGet(actions.request('/song')).reply(200, song);

    await actions.loadSong()(dispatch);
    
    expect(dispatch).toHaveBeenCalledWith(actions.replaceSong(song));
  });
});

describe('save song', () => {
  it('', () => {

  });
});