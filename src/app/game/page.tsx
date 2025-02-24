'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import Game from '@/components/SpaceInvaders/Game';
import Leaderboard from '@/components/SpaceInvaders/Leaderboard';
import { Container, Typography } from '@mui/material';

const GamePageContainer = styled(Container)`
    padding: 2rem;
`;

const GameSection = styled.div`
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: flex-start;
    margin-top: 2rem;
`;

const Title = styled(Typography)`
    color: #b8860b;
    text-align: center;
    margin-bottom: 2rem;
`;

const Instructions = styled(Typography)`
    color: #b8860b;
    text-align: center;
    margin-bottom: 2rem;
    font-style: italic;
`;

export default function GamePage() {
    // Mock leaderboard data - in a real app, this would come from a database
    const [leaderboardScores] = useState([
        { name: "Ghost Bride", score: 12000, date: "2024-10-31" },
        { name: "Zombie Groom", score: 10500, date: "2024-10-30" },
        { name: "Spooky DJ", score: 9000, date: "2024-10-29" },
        { name: "Phantom Baker", score: 8500, date: "2024-10-28" },
        { name: "Witch Officiant", score: 7500, date: "2024-10-27" },
    ]);

    return (
        <GamePageContainer>
            <Title variant="h2">
                🎃 Wedding Invaders 👻
            </Title>
            <Instructions variant="h6">
                Use arrow keys to move and spacebar to shoot! Defend your wedding cake from the spooky invaders!
            </Instructions>
            <GameSection>
                <Game />
                <Leaderboard scores={leaderboardScores} />
            </GameSection>
        </GamePageContainer>
    );
}
