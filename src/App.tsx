import { useState } from 'react';
import { Typography, Box, Container } from '@mui/material'
import './App.css'
import InputField from './components/inputField'
import TournamentBracket from './components/TournamentBracket'

function App() {
  const [players, setPlayers] = useState<string[]>([]);

  return (
    <Container sx={{ bgcolor: "hsl(0, 0%, 10%)" }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>Beer Pong</Typography>
      <Box sx={{ display: 'flex', height: '100vh', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 2 }}>
          <InputField onPlayersChange={setPlayers} />
        </Box>
        <Box sx={{ flex: 4 }}>
          <TournamentBracket players={players} />
        </Box>
      </Box>
    </Container>
  )
}

export default App
