import { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface InputFieldProps {
    onPlayersChange: (players: string[]) => void;
}

export default function InputField({ onPlayersChange }: InputFieldProps) {
    const [inputText, setInputText] = useState('');

    const handleSubmit = () => {
        // Split by newlines and filter out empty strings
        const players = inputText
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        onPlayersChange(players);
    };

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
            <Typography variant="h6">Insert Players</Typography>
            <TextField
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
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
                placeholder="Enter player names (one per line)..."
            />
            <Button
                variant="contained"
                sx={{ alignSelf: 'flex-start' }}
                onClick={handleSubmit}
            >
                Create Bracket
            </Button>
        </Box>
    )
}