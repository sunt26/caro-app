import { Routes, Route, BrowserRouter, Navigate, useNavigate } from 'react-router-dom'
import { RoomPage } from './pages/RoomPage'
import { useSocketStore } from './stores/useSocketStore'
import { useEffect } from 'react'
import { DashBoard } from './pages/DashBoard'
import { useGameStore } from './stores/useGameStore'
import { useShallow } from 'zustand/shallow'
import { GameStore } from './types'
import { Loading } from './components/Loading'
import { GamePage } from './pages/GamePage'

function App() {
  const { disconnectSocket, initSocket } = useSocketStore();
  const { currentUser } = useGameStore(useShallow((state: GameStore) => ({
    currentUser: state.currentUser
  })));
  const navigate = useNavigate();

  useEffect(() => {
    initSocket();

    return () => {
      disconnectSocket();
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Loading isLoading={true} />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="/room" element={<RoomPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  )
}

export default App
