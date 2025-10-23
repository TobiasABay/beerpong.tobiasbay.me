import { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ShuffleIcon from '@mui/icons-material/Shuffle';

interface InputFieldProps {
    onPlayersChange: (players: string[]) => void;
}

export default function InputField({ onPlayersChange }: InputFieldProps) {
    const [inputText, setInputText] = useState(() => {
        // Load from localStorage on component mount
        return localStorage.getItem('tournament-players') || '';
    });
    const [teamMode, setTeamMode] = useState(() => {
        // Load team mode preference from localStorage
        return localStorage.getItem('tournament-team-mode') === 'true';
    });

    const shortenLongNames = (text: string, maxLength: number = 30): string => {
        return text
            .split('\n')
            .map(line => {
                if (line.length <= maxLength) return line;

                // For team names with '/', try to shorten each part
                if (line.includes(' / ')) {
                    const [name1, name2] = line.split(' / ');
                    const maxEach = Math.floor(maxLength / 2) - 2; // Reserve space for ' / '

                    const shortName1 = name1.length > maxEach ?
                        name1.substring(0, maxEach - 3) + '...' : name1;
                    const shortName2 = name2.length > maxEach ?
                        name2.substring(0, maxEach - 3) + '...' : name2;

                    return `${shortName1} / ${shortName2}`;
                } else {
                    // For single names, just truncate
                    return line.substring(0, maxLength - 3) + '...';
                }
            })
            .join('\n');
    };

    const handleInputChange = (value: string) => {
        const shortenedValue = shortenLongNames(value);
        setInputText(shortenedValue);
        // Save to localStorage on every change
        localStorage.setItem('tournament-players', shortenedValue);
    };

    const handleTeamModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTeamMode = event.target.checked;
        setTeamMode(newTeamMode);
        localStorage.setItem('tournament-team-mode', newTeamMode.toString());
    };

    const handleSubmit = () => {
        // Split by newlines and filter out empty strings
        let players = inputText
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        // If team mode is enabled and no teams exist, auto-create teams
        if (teamMode && !players.some(player => player.includes('/'))) {
            players = createTeamsFromPlayers(players);
        }

        onPlayersChange(players);
    };

    const createTeamsFromPlayers = (individualPlayers: string[]): string[] => {
        const teams: string[] = [];

        // If odd number of players, the last one gets a bye
        const playerCount = individualPlayers.length;
        const teamCount = Math.floor(playerCount / 2);

        // Create teams of 2 players each
        for (let i = 0; i < teamCount; i++) {
            const player1 = individualPlayers[i * 2];
            const player2 = individualPlayers[i * 2 + 1];
            teams.push(`${player1} / ${player2}`);
        }

        // If there's an odd player left, they get a bye (single player team)
        if (playerCount % 2 === 1) {
            teams.push(individualPlayers[playerCount - 1]);
        }

        return teams;
    };

    const handleShuffle = () => {
        // Split by newlines, filter out empty strings
        let players = inputText
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (players.length === 0) return;

        // If team mode is enabled and no teams exist, auto-create teams first
        if (teamMode && !players.some(player => player.includes('/'))) {
            players = createTeamsFromPlayers(players);
        }
        // If team mode is disabled and teams exist, split teams into individual names
        else if (!teamMode && players.some(player => player.includes('/'))) {
            players = splitTeamsIntoPlayers(players);
        }

        // Shuffle based on team mode
        let shuffled: string[];
        if (teamMode) {
            // If team mode is enabled, break up existing teams and create new random pairings
            shuffled = shuffleAndRepairTeams([...players]);
        } else {
            // If team mode is disabled, just shuffle the sequence
            shuffled = shuffleTeamsAndNames([...players]);
        }

        const shuffledText = shuffled.join('\n');
        handleInputChange(shuffledText);
    };

    const splitTeamsIntoPlayers = (teams: string[]): string[] => {
        const individualPlayers: string[] = [];

        teams.forEach(team => {
            if (team.includes('/')) {
                // Split team into individual players
                const players = team.split('/').map(name => name.trim());
                individualPlayers.push(...players);
            } else {
                // Already an individual player
                individualPlayers.push(team);
            }
        });

        return individualPlayers;
    };

    const shuffleTeamsAndNames = (players: string[]): string[] => {
        // First shuffle the order of teams/players
        const shuffled = [...players];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Then shuffle names within each team
        return shuffled.map(item => {
            if (item.includes('/')) {
                // Split team members and shuffle their order
                const teamMembers = item.split('/').map(name => name.trim());
                const shuffledMembers = [...teamMembers];
                for (let i = shuffledMembers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledMembers[i], shuffledMembers[j]] = [shuffledMembers[j], shuffledMembers[i]];
                }
                return shuffledMembers.join(' / ');
            }
            return item;
        });
    };

    const shuffleAndRepairTeams = (players: string[]): string[] => {
        // Extract all individual names from teams
        const allNames: string[] = [];
        players.forEach(player => {
            if (player.includes('/')) {
                // Split team into individual names
                const names = player.split('/').map(name => name.trim());
                allNames.push(...names);
            } else {
                // Already an individual player
                allNames.push(player);
            }
        });

        // Shuffle all individual names
        const shuffledNames = [...allNames];
        for (let i = shuffledNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
        }

        // Create new random teams from shuffled individual names
        return createTeamsFromPlayers(shuffledNames);
    };

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'hsl(0, 0%, 15%)',
            p: 1,
            borderRadius: 2,
            border: '1px solid hsl(0, 0%, 25%)',
            boxSizing: 'border-box'
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: 2 }}>

                <Typography variant="h6" sx={{ color: 'white' }}>Insert Players</Typography>

                <FormControlLabel
                    control={
                        <Switch
                            checked={teamMode}
                            onChange={handleTeamModeChange}
                            color="primary"
                        />
                    }
                    label="Team Mode"
                    sx={{ alignSelf: 'flex-start', color: 'white' }}
                />
            </Box>

            <TextField
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                sx={{
                    backgroundColor: "hsl(0, 0%, 10%)",
                    width: '100%',
                    flex: 1,
                    '& .MuiInputBase-root': {
                        height: '100%',
                        alignItems: 'flex-start',
                        color: 'white'
                    },
                    '& .MuiInputBase-input': {
                        height: '100%',
                        alignItems: 'flex-start',
                        paddingTop: '14px',
                        overflow: 'auto',
                        color: 'white',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        '&::-webkit-scrollbar': {
                            width: '6px'
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'hsl(0, 0%, 20%)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'hsl(0, 0%, 40%)',
                            borderRadius: '3px'
                        }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'hsl(0, 0%, 25%)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'hsl(0, 0%, 35%)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'hsl(0, 0%, 50%)'
                    }
                }}
                multiline
                variant="outlined"
                placeholder={teamMode
                    ? "Enter player names (one per line) or team names (e.g., 'Tobias / Michelle')..."
                    : "Enter player names (one per line)..."
                }
            />
            <Box sx={{ display: 'flex', gap: 2, alignSelf: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={handleShuffle}
                    startIcon={<ShuffleIcon />}
                    sx={{ minWidth: 'auto' }}
                    title="Shuffle player order"
                >
                    Shuffle
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ flex: 1 }}
                >
                    Create
                </Button>

            </Box>
        </Box>
    )
}