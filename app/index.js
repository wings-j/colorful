import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Root} from './javascript/part/Root.js';

window.onload=function()
{
    ReactDOM.render(<Root />,document.getElementById('container'));
}
