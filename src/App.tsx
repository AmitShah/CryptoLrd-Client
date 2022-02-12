import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Home} from './components/Home'
import {Player} from './components/Player';
import {MetamaskStateProvider} from 'use-metamask'

function App() {
  return (
    <MetamaskStateProvider>
      <Player />
      <Home />
    </MetamaskStateProvider>);
}

export default App;
