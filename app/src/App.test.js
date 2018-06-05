import React from 'react';
// import ReactDOM from 'react-dom';
import { App } from './App';

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  // const x = shallow(<App />);
//  expect(wrapper.find('.ReactCodeMirror')).toHaveLength(0);

});
