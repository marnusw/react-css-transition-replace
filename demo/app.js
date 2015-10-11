/**
 * Fluxible client-side routing, rendering and rehydration of the React Application.
 */
/*global document, window */

require('babel/polyfill');

import React from 'react';
import ReactDOM from 'react-dom';

import Demo from './components/Demo.jsx';


window.React = React; // for chrome dev tool support

ReactDOM.render(React.createElement(Demo), document.getElementById('demo'));
