import React from 'react';
import './App.css';
import { Navigation } from './Navigation/Navigation';
import { Mola } from './Games/Mola';
import { Footer } from './Footer/Footer';

function App() {
  return (
    <div>
      <Navigation></Navigation>
      <Mola></Mola>
      <Footer></Footer>
    </div>
  );
}

export default App;
