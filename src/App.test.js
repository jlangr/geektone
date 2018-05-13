import React from 'react';
import ReactDOM from 'react-dom';
import Note from './Note';
import App, { time, transportTime } from './App';

it('renders without crashing', () => {
  // const div = document.createElement('div');
  // ReactDOM.render(<App />, div);
  // ReactDOM.unmountComponentAtNode(div);
});

it('returns canvas-adjusted x y coordinate', () => {
  const app = new App();
  const left = 100;
  const top = 20;
  const boundingRectWidth = 1000;
  const boundingRectHeight = 200;
  const boundingRect = {
    left: left,
    top: top,
    right: left + boundingRectWidth,
    bottom: top + boundingRectHeight
  };
  const canvas = {
    getBoundingClientRect: () => boundingRect,
    width: 2000,
    height: 1000
  };

  const position = app.mousePosition(canvas, { clientX: 300, clientY: 80 });

  expect(position).toEqual({
    x: (300 - left) / boundingRectWidth * 2000,
    y: (80 - top) / boundingRectHeight * 1000});
});
