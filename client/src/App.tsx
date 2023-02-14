import { useRef, useState } from 'react';
import reactLogo from '/assets/react.svg';
import './App.css';
import { io } from 'socket.io-client';
import { useGame } from './hooks/useGame';
import gameConfig from './config/gameConfig';

function App() {
  const [count, setCount] = useState(0);

  const parentEl = useRef<HTMLDivElement>(null);

  useGame(gameConfig, parentEl);

  return (
    <div className='App'>
      {/* <h1 className='text-3xl font-bold underline'>Hello world!</h1>
      <div>
        <a href='https://vitejs.dev' target='_blank' rel='noreferrer'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a href='https://reactjs.org' target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p> */}
      <div ref={parentEl} id='phaser-game'></div>
    </div>
  );
}

export default App;
