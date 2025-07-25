'use client'

import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Game from '@/components/SpaceInvaders/Game'
import Leaderboard from '@/components/SpaceInvaders/Leaderboard'
import ScoreSubmissionDialog from '@/components/SpaceInvaders/ScoreSubmissionDialog'
import { Container, Typography, CircularProgress, Alert } from '@mui/material'
import { getTopScores, submitScore, LeaderboardScore } from '@/lib/leaderboard'

const GamePageContainer = styled(Container)`
    padding: 2rem;
`

const GameSection = styled.div`
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: flex-start;
    margin-top: 2rem;
`

const Title = styled(Typography)`
    color: #b8860b;
    text-align: center;
    margin-bottom: 2rem;
`

export default function GamePage() {
    const [leaderboardScores, setLeaderboardScores] = useState<LeaderboardScore[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [scoreDialogOpen, setScoreDialogOpen] = useState(false)
    const [currentScore, setCurrentScore] = useState(0)
    const [isSubmittingScore, setIsSubmittingScore] = useState(false)
    const [isHighScore, setIsHighScore] = useState(false)

    // Load leaderboard scores on component mount
    useEffect(() => {
        loadLeaderboard()
    }, [])

    const loadLeaderboard = async () => {
        try {
            setLoading(true)
            setError(null)
            const scores = await getTopScores(10)
            setLeaderboardScores(scores)
        } catch (err) {
            console.error('Failed to load leaderboard:', err)
            setError('Failed to load leaderboard. Using offline mode.')
            // Fallback to mock data if Firebase fails
            setLeaderboardScores([
                { name: 'Ghost Bride', score: 12000, date: '2024-10-31' },
                { name: 'Zombie Groom', score: 10500, date: '2024-10-30' },
                { name: 'Spooky DJ', score: 9000, date: '2024-10-29' },
                { name: 'Phantom Baker', score: 8500, date: '2024-10-28' },
                { name: 'Witch Officiant', score: 7500, date: '2024-10-27' },
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleGameOver = useCallback(
        (score: number) => {
            // Using useCallback to prevent recreation on each render
            // Check if this score qualifies for the leaderboard
            const lowestScore = leaderboardScores.length > 0 ? Math.min(...leaderboardScores.map((s) => s.score)) : 0
            const highestScore = leaderboardScores.length > 0 ? Math.max(...leaderboardScores.map((s) => s.score)) : 0

            // Use setTimeout to defer state updates outside of render cycle
            setTimeout(() => {
                if (leaderboardScores.length < 10 || score > lowestScore) {
                    setCurrentScore(score)
                    setIsHighScore(score > highestScore)
                    setScoreDialogOpen(true)
                }
            }, 0)
        },
        [leaderboardScores]
    )

    const handleScoreSubmit = async (name: string) => {
        try {
            setIsSubmittingScore(true)
            await submitScore(name, currentScore)
            setScoreDialogOpen(false)
            // Reload leaderboard to show the new score
            await loadLeaderboard()
        } catch (err) {
            console.error('Failed to submit score:', err)
            setError('Failed to submit score. Please try again.')
        } finally {
            setIsSubmittingScore(false)
        }
    }

    const handleScoreDialogClose = () => {
        setScoreDialogOpen(false)
    }

    return (
        <GamePageContainer>
            <Title variant="h2">👾 Wedding Invaders 👻</Title>
            {error && (
                <Alert severity="warning" style={{ marginBottom: '1rem', backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
                    {error}
                </Alert>
            )}
            <GameSection>
                <Game onGameOver={handleGameOver} />
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '300px', height: '600px' }}>
                        <CircularProgress style={{ color: '#b8860b' }} />
                    </div>
                ) : (
                    <Leaderboard scores={leaderboardScores} />
                )}
            </GameSection>
            <ScoreSubmissionDialog open={scoreDialogOpen} score={currentScore} onSubmit={handleScoreSubmit} onClose={handleScoreDialogClose} isSubmitting={isSubmittingScore} isHighScore={isHighScore} />
        </GamePageContainer>
    )
}
