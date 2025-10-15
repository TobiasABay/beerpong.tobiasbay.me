import { useState } from 'react';
import { Typography, Box } from '@mui/material'
import './App.css'
import InputField from './components/inputField'
import TournamentBracket from './components/TournamentBracket'

function App() {
  const [players, setPlayers] = useState<string[]>([]);

  return (
    <>
      <Typography variant="h1">Beer Pong</Typography>
      <Box sx={{ display: 'flex', height: '100vh', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 2 }}>
          <InputField onPlayersChange={setPlayers} />
        </Box>
        <Box sx={{ flex: 4 }}>
          <TournamentBracket players={players} />
        </Box>
      </Box>
    </>
  )
}

export default App
