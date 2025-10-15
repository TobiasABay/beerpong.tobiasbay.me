import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface PlayerBoxProps {
    name: string;
    seed?: number;
    isSelected?: boolean;
    isMatched?: boolean;
    isWinner?: boolean;
    isLoser?: boolean;
    onClick?: () => void;
}

export default function PlayerBox({ name, seed, isSelected, isMatched, isWinner, isLoser, onClick }: PlayerBoxProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                backgroundColor: isWinner ? '#4caf50' : isLoser ? '#f44336' : isMatched ? '#f5f5f5' : isSelected ? '#e3f2fd' : 'white',
                color: isWinner || isLoser ? 'white' : 'inherit',
                border: isWinner ? '2px solid #2e7d32' : isLoser ? '2px solid #c62828' : isSelected ? '2px solid #ff9800' : isMatched ? '2px solid #9e9e9e' : '2px solid #1976d2',
                borderRadius: '6px',
                padding: '8px 12px',
                minWidth: '80px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                cursor: isMatched || isWinner || isLoser ? 'default' : 'pointer',
                position: 'relative',
                '&:hover': !isMatched && !isWinner && !isLoser ? {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)'
                } : {}
            }}
        >
            {seed && (
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: isWinner || isLoser ? 'rgba(255,255,255,0.8)' : '#666', 
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
                    color: isWinner || isLoser ? 'white' : '#333',
                    fontSize: '0.85rem'
                }}
            >
                {name}
            </Typography>
            
            {/* Winner/Loser icons */}
            {isWinner && (
                <CheckIcon 
                    sx={{ 
                        fontSize: '16px', 
                        color: 'white',
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }} 
                />
            )}
            {isLoser && (
                <CloseIcon 
                    sx={{ 
                        fontSize: '16px', 
                        color: 'white',
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }} 
                />
            )}
        </Box>
    );
}
