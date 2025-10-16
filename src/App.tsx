import { useState } from 'react';
import { Typography, Box, } from '@mui/material'
import './App.css'
import InputField from './components/inputField'
import TournamentBracket from './components/TournamentBracket'

function App() {
  const [players, setPlayers] = useState<string[]>([]);

  return (
    <>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>Beer Pong</Typography>
      <Box sx={{
        display: 'flex',
        height: '100vh',
        gap: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 2
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '300px',
          minWidth: '300px'
        }}>
          <InputField onPlayersChange={setPlayers} />
        </Box>
        <Box sx={{
          flex: 1,
          height: '100%',
          overflow: 'hidden'
        }}>
          <TournamentBracket players={players} />
        </Box>
      </Box>
    </>
  )
}

export default App
