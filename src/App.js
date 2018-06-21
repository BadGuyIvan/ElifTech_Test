import React from 'react';
import { hydrate } from 'react-dom';
import Home from './components/Home';
hydrate(
    <Home/>
    , document.getElementById("app"));