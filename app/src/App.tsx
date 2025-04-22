import { GameMenu } from './components/GameMenu'
import { GameBoard } from './components/GameBoard'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { useGameStore } from './stores/useGameStore'
import { useShallow } from 'zustand/shallow'
import { WelcomePage } from './pages/WelcomePage'
import { RoomPage } from './pages/RoomPage'

function App() {
  const { currentUser } = useGameStore(useShallow(state => {
    return {
      currentUser: state.currentUser,
    }
  }));
  const isInitUser = currentUser.name == "";

  return (
    <BrowserRouter>
      <Routes>
        {
          isInitUser ?
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
