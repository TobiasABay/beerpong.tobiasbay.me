import { useState } from 'react';
import { Typography, Box, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import './App.css'
import InputField from './components/inputField'
import TournamentBracket from './components/TournamentBracket'

function App() {
  const [players, setPlayers] = useState<string[]>([]);
  const [showInputField, setShowInputField] = useState(true);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, position: 'relative' }}>
        <Typography variant="h3" sx={{ color: 'white', textAlign: 'center' }}>Beer Pong</Typography>
        <IconButton
          onClick={() => setShowInputField(!showInputField)}
          sx={{
            position: 'absolute',
            right: 0,
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
          title={showInputField ? 'Hide input field' : 'Show input field'}
        >
          {showInputField ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Box>
      <Box sx={{
        display: 'flex',
        height: '100vh',
        gap: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 2
      }}>
        {showInputField && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '300px',
            minWidth: '300px'
          }}>
            <InputField onPlayersChange={setPlayers} />
          </Box>
        )}
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
