import { Typography, Box } from '@mui/material'
import './App.css'
import InputField from './components/inputField'

function App() {

  return (
    <>
      <Typography variant="h1">Beer Pong</Typography>
      <Box sx={{ display: 'flex', height: '100vh', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <InputField />
        </Box>
        <Box sx={{ flex: 4 }}>
          {/* Right side content */}
        </Box>
      </Box>
    </>
  )
}

export default App
