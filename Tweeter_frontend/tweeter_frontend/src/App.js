import React, { Component } from 'react';
import './App.css';
import MessagesDashBoard from './components/messages'

/**
 * Main App
 * consists of MessagesDashBoard.
 * @extends Component
 */
class App extends Component {
  render() {
    return (
      <div className="App">
        <MessagesDashBoard />
      </div>
    );
  }
}

export default App;
