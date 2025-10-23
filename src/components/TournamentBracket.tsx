import { useState, useEffect } from 'react';
import { Box, Typography, Modal, Fade } from '@mui/material';
import PlayerBox from './PlayerBox';
import Confetti from 'react-confetti';

interface Match {
    id: string;
    player1: string;
    player2: string;
    winner?: string;
    round: number;
    position: number;
}

interface TournamentBracketProps {
    players: string[];
}

export default function TournamentBracket({ players }: TournamentBracketProps) {
    const [matches, setMatches] = useState<Match[]>([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const [winner, setWinner] = useState<string>('');

    useEffect(() => {
        if (players.length === 0) {
            setMatches([]);
            return;
        }

        const initial: Match[] = [];

        // Create matches for all players, handling odd numbers properly
        for (let i = 0; i < players.length; i += 2) {
            if (i + 1 < players.length) {
                // Normal match between two players
                initial.push({
                    id: `round-1-match-${Math.floor(i / 2) + 1}`,
                    player1: players[i],
                    player2: players[i + 1],
                    round: 1,
                    position: Math.floor(i / 2) + 1,
                });
            } else {
                // Odd player gets a BYE - create a special match that auto-advances
                initial.push({
                    id: `round-1-match-${Math.floor(i / 2) + 1}`,
                    player1: players[i],
                    player2: 'BYE',
                    winner: players[i], // Auto-advance the player
                    round: 1,
                    position: Math.floor(i / 2) + 1,
                });
            }
        }

        setMatches(initial);
    }, [players]);

    const handleMatchResult = (id: string, winner: string) => {
        const updated = matches.map(m => (m.id === id ? { ...m, winner } : m));
        setMatches(updated);
        const match = updated.find(m => m.id === id);

        // Check if this is the final match
        if (match && match.round === totalRounds) {
            setWinner(winner);
            setShowCelebration(true);
            // Auto-hide celebration after 5 seconds
            setTimeout(() => setShowCelebration(false), 5000);
        }

        if (match) createNextRound(match, winner, updated);
    };

    const createNextRound = (current: Match, _winner: string, all: Match[]) => {
        const nextRound = current.round + 1;
        const currentRoundMatches = all.filter(m => m.round === current.round);
        const currentRoundWinners = currentRoundMatches.filter(m => m.winner);

        // Check if this is the last match in the current round
        const isLastMatchInRound = currentRoundWinners.length === currentRoundMatches.length;

        if (isLastMatchInRound) {
            // Get all winners from current round, sorted by position
            const winners = currentRoundMatches
                .filter(m => m.winner)
                .sort((a, b) => a.position - b.position)
                .map(m => m.winner!);

            // Handle odd number of winners by giving the last one a BYE
            if (winners.length % 2 === 1) {
                const lastWinner = winners.pop()!; // Remove the last winner

                // Create matches for the remaining winners (even number)
                const newMatches = [];
                for (let i = 0; i < winners.length; i += 2) {
                    newMatches.push({
                        id: `round-${nextRound}-match-${Math.floor(i / 2) + 1}`,
                        player1: winners[i],
                        player2: winners[i + 1],
                        round: nextRound,
                        position: Math.floor(i / 2) + 1,
                    });
                }

                // Give the last winner a BYE in the next round
                newMatches.push({
                    id: `round-${nextRound}-match-${Math.floor(winners.length / 2) + 1}`,
                    player1: lastWinner,
                    player2: 'BYE',
                    winner: lastWinner, // Auto-advance
                    round: nextRound,
                    position: Math.floor(winners.length / 2) + 1,
                });

                setMatches([...all, ...newMatches]);
            } else {
                // Even number of winners - create normal matches
                const newMatches = [];
                for (let i = 0; i < winners.length; i += 2) {
                    newMatches.push({
                        id: `round-${nextRound}-match-${Math.floor(i / 2) + 1}`,
                        player1: winners[i],
                        player2: winners[i + 1],
                        round: nextRound,
                        position: Math.floor(i / 2) + 1,
                    });
                }
                setMatches([...all, ...newMatches]);
            }
        }
    };

    const totalRounds = Math.ceil(Math.log2(players.length || 1));
    const getMatchesByRound = (round: number) => matches.filter(m => m.round === round);


    return (
        <>
            {showCelebration && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                />
            )}

            <Modal
                open={showCelebration}
                onClose={() => setShowCelebration(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Fade in={showCelebration}>
                    <Box sx={{
                        backgroundColor: 'hsl(0, 0%, 10%)',
                        border: '3px solid #ffd700',
                        borderRadius: 4,
                        p: 6,
                        textAlign: 'center',
                        maxWidth: '80vw',
                        maxHeight: '80vh',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
                            opacity: 0.1,
                            zIndex: -1
                        }
                    }}>
                        <Typography variant="h1" sx={{
                            color: '#ffd700',
                            fontWeight: 'bold',
                            textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                            mb: 2,
                            fontSize: { xs: '2rem', md: '4rem' }
                        }}>
                            🏆 CHAMPION! 🏆
                        </Typography>

                        <Typography variant="h2" sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            mb: 4,
                            fontSize: { xs: '1.5rem', md: '3rem' },
                            wordBreak: 'break-word'
                        }}>
                            {winner}
                        </Typography>

                        <Typography variant="h4" sx={{
                            color: '#ffd700',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            fontSize: { xs: '1rem', md: '1.5rem' }
                        }}>
                            🎉 Congratulations! 🎉
                        </Typography>
                    </Box>
                </Fade>
            </Modal>

            <Box sx={{
                p: 1,
                position: 'relative',
                backgroundColor: 'hsl(0, 0%, 15%)',
                height: '100%',
                overflow: 'auto'
            }}>
                <Typography variant="h4" sx={{
                    textAlign: 'center',
                    mb: 4,
                    color: 'white',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                    🏆 Tournament Bracket 🏆
                </Typography>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: 3,
                    flexWrap: 'wrap'
                }}>
                    {Array.from({ length: totalRounds }, (_, r) => {
                        const round = r + 1;
                        const roundMatches = getMatchesByRound(round);

                        return (
                            <Box
                                key={round}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 3,
                                    position: 'relative'
                                }}
                            >
                                <Typography variant="h6" sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    mb: 2,
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                    backgroundColor: 'hsl(0, 0%, 15%)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid hsl(0, 0%, 25%)'
                                }}>
                                    {round === totalRounds ? '🏆 Final' :
                                        round === totalRounds - 1 ? '🥈 Semi-Finals' :
                                            round === totalRounds - 2 ? '🥉 Quarter-Finals' :
                                                `Round ${round}`}
                                </Typography>
                                {roundMatches.length > 0 ? (
                                    roundMatches.map(match => (
                                        <Box
                                            key={match.id}
                                            id={match.id}
                                            sx={{
                                                backgroundColor: 'hsl(0, 0%, 15%)',
                                                border: '2px solid transparent',
                                                borderRadius: 3,
                                                p: 3,
                                                minWidth: 220,
                                                textAlign: 'center',
                                                position: 'relative',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                                                    border: '2px solid hsl(0, 0%, 25%)'
                                                }
                                            }}
                                        >
                                            <PlayerBox
                                                name={match.player1}
                                                isWinner={match.winner === match.player1}
                                                isLoser={match.winner === match.player2}
                                                onClick={match.player2 === 'BYE' ? undefined : () => handleMatchResult(match.id, match.player1)}
                                            />
                                            <Typography variant="caption" sx={{
                                                color: 'hsl(0, 0%, 60%)',
                                                fontWeight: 'bold',
                                                fontSize: '0.8rem',
                                                letterSpacing: '1px'
                                            }}>
                                                {match.player2 === 'BYE' ? 'BYE' : 'VS'}
                                            </Typography>
                                            {match.player2 === 'BYE' ? (
                                                <Box sx={{
                                                    backgroundColor: 'hsl(0, 0%, 20%)',
                                                    border: '2px solid hsl(0, 0%, 30%)',
                                                    borderRadius: '6px',
                                                    padding: '8px 12px',
                                                    minWidth: '80px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'hsl(0, 0%, 60%)',
                                                    fontStyle: 'italic'
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                        BYE
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <PlayerBox
                                                    name={match.player2}
                                                    isWinner={match.winner === match.player2}
                                                    isLoser={match.winner === match.player1}
                                                    onClick={() => handleMatchResult(match.id, match.player2)}
                                                />
                                            )}
                                        </Box>
                                    ))
                                ) : (
                                    <Box
                                        sx={{
                                            backgroundColor: 'hsl(0, 0%, 10%)',
                                            border: '2px dashed hsl(0, 0%, 30%)',
                                            borderRadius: 3,
                                            p: 3,
                                            minWidth: 220,
                                            minHeight: 120,
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'hsl(0, 0%, 50%)',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {round === totalRounds ? 'Waiting for Semi-Finals...' :
                                                round === totalRounds - 1 ? 'Waiting for Quarter-Finals...' :
                                                    'Waiting for previous round...'}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>

            </Box>
        </>
    );
}
