import React from 'react';
import styled from 'styled-components';
import { Typography, Box } from '@mui/material';

const LeaderboardContainer = styled(Box)`
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #b8860b;
    padding: 1rem;
    width: 300px;
    height: 600px;
`;

const ScoreEntry = styled(Box)`
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid rgba(184, 134, 11, 0.3);
    
    &:hover {
        background: rgba(184, 134, 11, 0.1);
    }
`;

const GoldText = styled(Typography)`
    color: #b8860b;
`;

interface Score {
    name: string;
    score: number;
    date: string;
}

interface LeaderboardProps {
    scores: Score[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
    return (
        <LeaderboardContainer>
            <GoldText variant="h4" gutterBottom align="center">
                🏆 Leaderboard 🏆
            </GoldText>
            {scores.map((score, index) => (
                <ScoreEntry key={index}>
                    <GoldText>
                        {index + 1}. {score.name}
                    </GoldText>
                    <GoldText>{score.score}</GoldText>
                </ScoreEntry>
            ))}
        </LeaderboardContainer>
    );
};

export default Leaderboard;
