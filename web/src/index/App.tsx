import React from 'react';
import { BottomBar, MainWindow, TopBar } from './MainLayout';


function App() {
  return (
    <div className="h-screen flex flex-col">
      <TopBar/>
      <MainWindow/>
      <BottomBar/>
    </div>
  );

}

export default App;
