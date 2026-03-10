import React, { useState } from 'react';
import Gallery from './components/Gallery';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📸 Image Gallery</h1>
        <p>Explore our beautiful collection of images</p>
      </header>
      <main>
        <Gallery />
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 Image Gallery. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;