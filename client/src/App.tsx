import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { io } from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_API_URL}`);

function App() {
  const [count, setCount] = useState(0);

  socket.on('connect', function () {
    console.log('Connected');

    socket.emit('events', { test: 'test' });
    socket.emit('identity', 0, (response: number) =>
      console.log('Identity:', response)
    );
    socket.emit('message', { message: 'testMessage' }, (response: string) => {
      console.log('message', response);
    });
  });
  socket.on('events', function (data) {
    console.log('event', data);
  });
  socket.on('exception', function (data) {
    console.log('event', data);
  });
  socket.on('disconnect', function () {
    console.log('Disconnected');
  });

  return (
    <div className='App'>
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
      </p>
    </div>
  );
}

export default App;
