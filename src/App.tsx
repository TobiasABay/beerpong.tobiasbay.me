import { useState } from 'react';
import { Typography, Box, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import './App.css'
import InputField from './components/inputField'
import TournamentBracket from './components/TournamentBracket'
import FullscreenButton from './components/FullscreenButton';

function App() {
  const [players, setPlayers] = useState<string[]>([]);
  const [showInputField, setShowInputField] = useState(true);

  return (
    <>
      {/* Fixed control buttons in top-right corner */}
      <Box sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        display: 'flex',
        gap: 1,
        zIndex: 1000
      }}>
        <IconButton
          onClick={() => setShowInputField(!showInputField)}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease'
          }}
          title={showInputField ? 'Hide input field' : 'Show input field'}
        >
          {showInputField ? <VisibilityOff /> : <Visibility />}
        </IconButton>
        <FullscreenButton />
      </Box>

      {/* Main title */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3" sx={{ color: 'white', textAlign: 'center' }}>Beer Pong</Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        gap: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 2
      }}>
        {showInputField && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            minWidth: '300px',
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: 'calc(100vh - 120px)'
          }}>
            <InputField onPlayersChange={setPlayers} />
          </Box>
        )}
        <Box sx={{
          flex: 1,
          minHeight: '100vh'
        }}>
          <TournamentBracket players={players} />
        </Box>
      </Box>
    </>
  )
}

export default App
