import React from 'react';
import './App.css';
import { Mola } from './Games/Mola';
import { Navigation } from './Navigation/Navigation';

function App() {
  return (
    <div>
      <Navigation></Navigation>
      <Mola></Mola>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default App;
