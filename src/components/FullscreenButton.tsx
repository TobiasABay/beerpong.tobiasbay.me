import { IconButton } from '@mui/material';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import { useFullscreen } from './hooks/useFullscreen';

interface FullscreenButtonProps {
    sx?: object;
}

export default function FullscreenButton({ sx = {} }: FullscreenButtonProps) {
    const { isFullscreen, toggleFullscreen } = useFullscreen();

    return (
        <IconButton
            onClick={toggleFullscreen}
            sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease',
                ...sx
            }}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
    );
}
