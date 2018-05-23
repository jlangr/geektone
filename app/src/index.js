import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './store';

// TODO move to appropriate polyfill
// NEEDED? IE not supported
/*
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}
*/

const Root = () => (
  <Provider store={store}>
    <App/>
  </Provider>);

ReactDOM.render(Root(), document.getElementById('root'));
registerServiceWorker();
