import { Box, Typography } from '@mui/material';

interface PlayerBoxProps {
    name: string;
    seed?: number;
}

export default function PlayerBox({ name, seed }: PlayerBoxProps) {
    return (
        <Box
            sx={{
                backgroundColor: 'white',
                border: '2px solid #1976d2',
                borderRadius: '6px',
                padding: '8px 12px',
                minWidth: '80px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)'
                }
            }}
        >
            {seed && (
                <Typography
                    variant="caption"
                    sx={{
                        color: '#666',
                        fontSize: '0.6rem',
                        fontWeight: 'bold'
                    }}
                >
                    #{seed}
                </Typography>
            )}
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '0.85rem'
                }}
            >
                {name}
            </Typography>
        </Box>
    );
}
