import React from 'react';
import ReactDOM from 'react-dom';
import './js/ArrayProtos';
import Note from './Note';
import App, { time, transportTime } from './App';

it('renders without crashing', () => {
  // const div = document.createElement('div');
  // ReactDOM.render(<App />, div);
  // ReactDOM.unmountComponentAtNode(div);
});

describe('time', () => {
  let app;
  beforeEach(() => app = new App());

  it('converts notes into equivalent 16ths', () => {
    expect(app.time('16n')).toEqual(1);
    expect(app.time('8n')).toEqual(2);
    expect(app.time('4n')).toEqual(4);
    expect(app.time('2n')).toEqual(8);
    expect(app.time('1n')).toEqual(16);
  });

  it('converts number of 16s into bars:quarters:sixteenths format', () => {
    expect(app.transportTime(1)).toEqual('0:0:1');
    expect(app.transportTime(2)).toEqual('0:0:2');
    expect(app.transportTime(4)).toEqual('0:1:0');
    expect(app.transportTime(5)).toEqual('0:1:1');
    expect(app.transportTime(15)).toEqual('0:3:3');
    expect(app.transportTime(16)).toEqual('1:0:0');
    expect(app.transportTime(17)).toEqual('1:0:1');
    expect(app.transportTime(30)).toEqual('1:3:2');
    expect(app.transportTime(33)).toEqual('2:0:1');
  });

  it('creates note objects with time transpoprts', () => {
    let notes = [ new Note('C4', '8n'), new Note('D4', '4n')];

    expect(app.noteObjects(notes)).toEqual([
      { name: 'C4', duration: '8n', time: '0:0:0'},
      { name: 'D4', duration: '4n', time: '0:0:2'}
    ]);
  });

});
