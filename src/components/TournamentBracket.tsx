import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import PlayerBox from './PlayerBox';

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
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    // Initialize bracket when players change
    useEffect(() => {
        if (players.length === 0) {
            setMatches([]);
            return;
        }

        // Create initial round matches
        const initialMatches: Match[] = [];
        for (let i = 0; i < players.length; i += 2) {
            if (i + 1 < players.length) {
                initialMatches.push({
                    id: `round-1-match-${Math.floor(i / 2) + 1}`,
                    player1: players[i],
                    player2: players[i + 1],
                    round: 1,
                    position: Math.floor(i / 2) + 1
                });
            } else {
                // Odd number of players - give last player a bye
                initialMatches.push({
                    id: `round-1-match-${Math.floor(i / 2) + 1}`,
                    player1: players[i],
                    player2: 'BYE',
                    winner: players[i],
                    round: 1,
                    position: Math.floor(i / 2) + 1
                });
            }
        }
        setMatches(initialMatches);
    }, [players]);

    const handleMatchResult = (matchId: string, winner: string) => {
        const updatedMatches = matches.map(match =>
            match.id === matchId ? { ...match, winner } : match
        );
        setMatches(updatedMatches);

        // Auto-advance winners to next round
        const match = updatedMatches.find(m => m.id === matchId);
        if (match) {
            createNextRoundMatch(match, winner, updatedMatches);
        }
    };

    const createNextRoundMatch = (currentMatch: Match, winner: string, currentMatches: Match[]) => {
        const nextRound = currentMatch.round + 1;
        const nextPosition = Math.ceil(currentMatch.position / 2);

        // Find the sibling match that pairs with this one
        const siblingPosition = currentMatch.position % 2 === 1 ?
            currentMatch.position + 1 :
            currentMatch.position - 1;

        const siblingMatch = currentMatches.find(m =>
            m.round === currentMatch.round && m.position === siblingPosition
        );

        // Check if next round match already exists
        const existingMatch = currentMatches.find(m =>
            m.round === nextRound && m.position === nextPosition
        );

        if (siblingMatch && siblingMatch.winner) {
            // Both matches are complete, create or update next round match
            if (!existingMatch) {
                // Create new next round match
                const newMatch: Match = {
                    id: `round-${nextRound}-match-${nextPosition}`,
                    player1: currentMatch.position % 2 === 1 ? winner : siblingMatch.winner,
                    player2: currentMatch.position % 2 === 1 ? siblingMatch.winner : winner,
                    round: nextRound,
                    position: nextPosition
                };
                setMatches([...currentMatches, newMatch]);
            } else {
                // Update existing next round match
                const isFirstPlayer = currentMatch.position % 2 === 1;
                const updatedNextMatch = {
                    ...existingMatch,
                    player1: isFirstPlayer ? winner : existingMatch.player1,
                    player2: isFirstPlayer ? existingMatch.player2 : winner
                };
                setMatches(currentMatches.map(m =>
                    m.id === existingMatch.id ? updatedNextMatch : m
                ));
            }
        }
    };

    const getMatchesByRound = (round: number) => {
        return matches.filter(match => match.round === round);
    };

    const getTotalRounds = () => {
        if (players.length === 0) return 0;
        return Math.ceil(Math.log2(players.length));
    };

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

    const totalRounds = getTotalRounds();

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            padding: 2,
            overflow: 'auto',
            backgroundColor: '#f5f5f5'
        }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#333', textAlign: 'center' }}>
                Tournament Bracket
            </Typography>

            {/* Bracket Layout */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                minHeight: '400px',
                position: 'relative'
            }}>
                {Array.from({ length: totalRounds }, (_, roundIndex) => {
                    const round = roundIndex + 1;
                    const roundMatches = getMatchesByRound(round);

                    return (
                        <Box key={round} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            minWidth: '200px',
                            alignItems: 'center',
                            position: 'relative',
                            justifyContent: round === 1 ? 'flex-start' : 'center'
                        }}>
                            <Typography variant="subtitle1" sx={{
                                fontWeight: 'bold',
                                color: '#333',
                                mb: 1
                            }}>
                                {round === totalRounds ? 'Final' :
                                    round === totalRounds - 1 ? 'Semi-Finals' :
                                        round === totalRounds - 2 ? 'Quarter-Finals' :
                                            `Round ${round}`}
                            </Typography>

                            {roundMatches.map((match, matchIndex) => (
                                <Box key={match.id} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    alignItems: 'center',
                                    position: 'relative',
                                    // Center the Round 2 match between the two Round 1 matches
                                    marginTop: round === 2 && roundMatches.length === 1 ? '40px' : '0px'
                                }}>
                                    {/* Connection lines from previous round */}
                                    {round > 1 && (
                                        <Box sx={{
                                            position: 'absolute',
                                            left: '-100px',
                                            top: '50%',
                                            width: '100px',
                                            height: '2px',
                                            backgroundColor: '#ddd',
                                            zIndex: 1,
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                right: '-2px',
                                                top: '-3px',
                                                width: '8px',
                                                height: '8px',
                                                backgroundColor: '#ddd',
                                                transform: 'rotate(45deg)'
                                            }
                                        }} />
                                    )}

                                    {/* Match Box */}
                                    <Box sx={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        padding: '8px 12px',
                                        minWidth: '150px',
                                        textAlign: 'center',
                                        position: 'relative',
                                        zIndex: 2
                                    }}>
                                        {/* Small square indicator */}
                                        <Box sx={{
                                            position: 'absolute',
                                            left: '-6px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: '#666',
                                            borderRadius: '2px'
                                        }} />

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <PlayerBox
                                                name={match.player1}
                                                isWinner={match.winner === match.player1}
                                                isLoser={match.winner === match.player2}
                                                onClick={() => handleMatchResult(match.id, match.player1)}
                                            />
                                            
                                            <Typography variant="caption" sx={{ color: '#666', textAlign: 'center' }}>VS</Typography>
                                            
                                            <PlayerBox
                                                name={match.player2}
                                                isWinner={match.winner === match.player2}
                                                isLoser={match.winner === match.player1}
                                                onClick={() => handleMatchResult(match.id, match.player2)}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Connection lines to next round */}
                                    {round < totalRounds && (
                                        <Box sx={{
                                            position: 'absolute',
                                            right: '-100px',
                                            top: '50%',
                                            width: '100px',
                                            height: '2px',
                                            backgroundColor: '#ddd',
                                            zIndex: 1,
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                right: '-6px',
                                                top: '-2px',
                                                width: '0',
                                                height: '0',
                                                borderLeft: '4px solid #ddd',
                                                borderTop: '2px solid transparent',
                                                borderBottom: '2px solid transparent'
                                            }
                                        }} />
                                    )}

                                    {/* Vertical merge lines for pairs of matches */}
                                    {roundMatches.length > 1 && matchIndex % 2 === 1 && (
                                        <Box sx={{
                                            position: 'absolute',
                                            right: '-50px',
                                            top: '-40px',
                                            width: '2px',
                                            height: '80px',
                                            backgroundColor: '#ddd',
                                            zIndex: 1
                                        }} />
                                    )}

                                    {/* Horizontal merge line from vertical to next round */}
                                    {roundMatches.length > 1 && matchIndex % 2 === 1 && (
                                        <Box sx={{
                                            position: 'absolute',
                                            right: '-50px',
                                            top: '50%',
                                            width: '50px',
                                            height: '2px',
                                            backgroundColor: '#ddd',
                                            zIndex: 1,
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                right: '-6px',
                                                top: '-2px',
                                                width: '0',
                                                height: '0',
                                                borderLeft: '4px solid #ddd',
                                                borderTop: '2px solid transparent',
                                                borderBottom: '2px solid transparent'
                                            }
                                        }} />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
