import './App.css';
import Header from './components/Header';
import Workers from './components/Workers';
import {GameProvider} from './GameProvider';
import Resources from './components/Resources';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <Header />
        <Resources />
        <Workers />
      </div>
    </GameProvider>
  );
}

export default App;
