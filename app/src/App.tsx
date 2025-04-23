import { GameMenu } from './components/GameMenu'
import { GameBoard } from './components/GameBoard'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { useGameStore } from './stores/useGameStore'
import { useShallow } from 'zustand/shallow'
import { WelcomePage } from './pages/WelcomePage'
import { RoomPage } from './pages/RoomPage'
import { useSocketStore } from './stores/useSocketStore'
import { use, useEffect } from 'react'

function App() {
  // const { currentUser } = useGameStore(useShallow(state => {
  //   return {
  //     currentUser: state.currentUser,
  //   }
  // }));
  // const isInitUser = currentUser.name == "";

  const { disconnectSocket, initSocket, isReady } = useSocketStore();
  const { currentUser } = useGameStore(useShallow(state => {
    return {
      currentUser: state.currentUser,
    }
  }));
  useEffect(() => {
    initSocket();
    return () => {
      disconnectSocket();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {
          !isReady ?
            <Route path="/" element={<WelcomePage />} />
            :
            <>
              <Route path="/" element={<GameMenu />} />
              <Route path="/room" element={<RoomPage />} />
              <Route path="/game/:roomId" element={<GameBoard />} />
            </>
        }
      </Routes>
    </BrowserRouter>
  )
}

export default App
