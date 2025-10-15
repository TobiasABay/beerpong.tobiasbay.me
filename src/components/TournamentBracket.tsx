import { Box, Typography } from '@mui/material';
import PlayerBox from './PlayerBox';

interface TournamentBracketProps {
    players: string[];
}

export default function TournamentBracket({ players }: TournamentBracketProps) {
    if (players.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#666'
            }}>
                <Typography variant="h6">
                    Enter players and click "Create Bracket" to start
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            padding: 2,
            overflow: 'auto'
        }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#333' }}>
                Tournament Bracket
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'flex-start'
            }}>
                {players.map((player, index) => (
                    <PlayerBox
                        key={index}
                        name={player}
                        seed={index + 1}
                    />
                ))}
            </Box>
        </Box>
    );
}
