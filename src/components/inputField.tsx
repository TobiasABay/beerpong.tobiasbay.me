import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function InputField() {
    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
            <Typography variant="h6">Insert Players</Typography>
            <TextField
                sx={{
                    backgroundColor: 'white',
                    width: '100%',
                    flex: 1,
                    '& .MuiInputBase-root': {
                        height: '100%',
                        alignItems: 'flex-start'
                    },
                    '& .MuiInputBase-input': {
                        height: '100%',
                        alignItems: 'flex-start',
                        paddingTop: '14px',
                        overflow: 'auto'
                    }
                }}
                multiline
                variant="outlined"
                placeholder="Enter player names..."
            />
            <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>Submit</Button>
        </Box>
    )
}