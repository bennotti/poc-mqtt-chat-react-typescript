import React from 'react';
import logo from './logo.svg';
import './App.css';
import HookMqtt from './hooks/mqtt'

function App() {
  return (
    <div className="App">
      <HookMqtt />
    </div>
  );
}

export default App;
