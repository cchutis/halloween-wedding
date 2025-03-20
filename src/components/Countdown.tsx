import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import styled from 'styled-components'

const CountdownContainer = styled(Box)`
    display: flex;
    gap: 3rem;
    justify-content: center;
    padding-top: 4rem;
    @media (max-width: 768px) {
        gap: 0;
        margin-top: 3rem;
        padding: 0 1rem;
    }
`

const TimeUnit = styled(Box)`
    text-align: center;
    min-width: 100px;
`

const TimeNumber = styled(Typography)`
    color: #b8860b;
    font-size: 6rem !important;
    font-family: 'Estonia';
    margin-bottom: 0.5rem !important;
    @media (max-width: 768px) {
        font-size: 2rem !important;
    }
`

const TimeLabel = styled(Typography)`
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.2rem;
    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
`

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const weddingDate = new Date('2025-10-31T18:30:00-04:00')

        const calculateTimeLeft = () => {
            const now = new Date()
            const difference = weddingDate.getTime() - now.getTime()

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24))
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
                const minutes = Math.floor((difference / 1000 / 60) % 60)
                const seconds = Math.floor((difference / 1000) % 60)

                setTimeLeft({ days, hours, minutes, seconds })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <CountdownContainer>
            <TimeUnit>
                <TimeNumber variant="h3">{timeLeft.days}</TimeNumber>
                <TimeLabel>Days</TimeLabel>
            </TimeUnit>
            <TimeUnit>
                <TimeNumber variant="h3">{timeLeft.hours}</TimeNumber>
                <TimeLabel>Hours</TimeLabel>
            </TimeUnit>
            <TimeUnit>
                <TimeNumber variant="h3">{timeLeft.minutes}</TimeNumber>
                <TimeLabel>Minutes</TimeLabel>
            </TimeUnit>
            <TimeUnit>
                <TimeNumber variant="h3">{timeLeft.seconds}</TimeNumber>
                <TimeLabel>Seconds</TimeLabel>
            </TimeUnit>
        </CountdownContainer>
    )
}

export default Countdown
