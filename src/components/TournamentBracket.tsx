import { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
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
    const [svgKey, setSvgKey] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (players.length === 0) {
            setMatches([]);
            return;
        }

        const initial: Match[] = [];
        for (let i = 0; i < players.length; i += 2) {
            if (i + 1 < players.length) {
                initial.push({
                    id: `round-1-match-${Math.floor(i / 2) + 1}`,
                    player1: players[i],
                    player2: players[i + 1],
                    round: 1,
                    position: Math.floor(i / 2) + 1,
                });
            } else {
                initial.push({
                    id: `round-1-match-${Math.floor(i / 2) + 1}`,
                    player1: players[i],
                    player2: 'BYE',
                    winner: players[i],
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
        if (match) createNextRound(match, winner, updated);

        // Force SVG re-render after DOM updates
        setTimeout(() => setSvgKey(prev => prev + 1), 10);
    };

    const createNextRound = (current: Match, winner: string, all: Match[]) => {
        const nextRound = current.round + 1;
        const nextPos = Math.ceil(current.position / 2);
        const siblingPos = current.position % 2 === 1 ? current.position + 1 : current.position - 1;
        const sibling = all.find(m => m.round === current.round && m.position === siblingPos);
        const existing = all.find(m => m.round === nextRound && m.position === nextPos);

        if (sibling && sibling.winner) {
            if (!existing) {
                setMatches([
                    ...all,
                    {
                        id: `round-${nextRound}-match-${nextPos}`,
                        player1: current.position % 2 === 1 ? winner : sibling.winner,
                        player2: current.position % 2 === 1 ? sibling.winner : winner,
                        round: nextRound,
                        position: nextPos,
                    },
                ]);
            } else {
                // Update existing next round match
                const isFirstPlayer = current.position % 2 === 1;
                const updatedNextMatch = {
                    ...existing,
                    player1: isFirstPlayer ? winner : existing.player1,
                    player2: isFirstPlayer ? existing.player2 : winner
                };
                setMatches(all.map(m =>
                    m.id === existing.id ? updatedNextMatch : m
                ));
            }
        }
    };

    const totalRounds = Math.ceil(Math.log2(players.length || 1));
    const getMatchesByRound = (round: number) => matches.filter(m => m.round === round);


    return (
        <Box ref={containerRef} sx={{ p: 1, position: 'relative', backgroundColor: '#f7f7f7' }}>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4 }}>
                {Array.from({ length: totalRounds }, (_, r) => {
                    const round = r + 1;
                    const roundMatches = getMatchesByRound(round);

                    return (
                        <Box
                            key={round}
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                        >
                            {roundMatches.map(match => (
                                <Box
                                    key={match.id}
                                    id={match.id}
                                    sx={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: 2,
                                        p: 2,
                                        minWidth: 200,
                                        textAlign: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <PlayerBox
                                        name={match.player1}
                                        isWinner={match.winner === match.player1}
                                        isLoser={match.winner === match.player2}
                                        onClick={() => handleMatchResult(match.id, match.player1)}
                                    />
                                    <Typography variant="caption">VS</Typography>
                                    <PlayerBox
                                        name={match.player2}
                                        isWinner={match.winner === match.player2}
                                        isLoser={match.winner === match.player1}
                                        onClick={() => handleMatchResult(match.id, match.player2)}
                                    />
                                </Box>
                            ))}
                        </Box>
                    );
                })}
            </Box>

            {/* SVG Overlay for connections */}
            <svg
                key={svgKey}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
            >
                {matches.map(m => {
                    // Only draw connections from matches that have winners
                    if (!m.winner) return null;

                    const nextRound = m.round + 1;
                    const nextPos = Math.ceil(m.position / 2);
                    const nextMatch = matches.find(
                        x => x.round === nextRound && x.position === nextPos
                    );
                    if (!nextMatch) return null;

                    const fromBox = document.getElementById(m.id);
                    const toBox = document.getElementById(nextMatch.id);
                    if (!fromBox || !toBox) return null;

                    const fromRect = fromBox.getBoundingClientRect();
                    const toRect = toBox.getBoundingClientRect();
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    if (!containerRect) return null;

                    const x1 = fromRect.right - containerRect.left;
                    const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
                    const x2 = toRect.left - containerRect.left;
                    const y2 = toRect.top + toRect.height / 2 - containerRect.top;

                    return (
                        <path
                            key={`${m.id}-to-${nextMatch.id}`}
                            d={`M${x1},${y1} C${x1 + 40},${y1} ${x2 - 40},${y2} ${x2},${y2}`}
                            stroke="#444"
                            strokeWidth="2"
                            fill="none"
                        />
                    );
                })}
            </svg>
        </Box>
    );
}
