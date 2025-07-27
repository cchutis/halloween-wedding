import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import styled from 'styled-components'

const CountdownContainer = styled(Box)`
    display: flex;
    gap: 3rem;
    justify-content: center;
    padding-top: 2rem;
    margin-top: 1rem;
    position: relative;

    @media (max-width: 768px) {
        gap: 0.75rem;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, auto);
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        width: 100%;
        max-width: 280px;
        margin-left: auto;
        margin-right: auto;
    }
`

const TimeUnit = styled(Box)`
    text-align: center;
    min-width: 80px;
    position: relative;

    &:not(:last-child)::after {
        content: ':';
        position: absolute;
        right: -1.8rem;
        top: 0;
        color: rgba(184, 134, 11, 0.7);
        font-size: 3rem;
        line-height: 1;
        font-weight: 300;
        margin-top: 24px;

        @media (max-width: 768px) {
            content: none;
        }
    }

    @media (max-width: 768px) {
        min-width: unset;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`

const TimeNumber = styled(Typography)`
    color: #b8860b;
    font-size: 5rem !important;
    font-family: 'Estonia';
    margin-bottom: 0.5rem !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    font-weight: 500;
    line-height: 1;

    @media (max-width: 768px) {
        font-size: 2.2rem !important;
        margin-bottom: 0.25rem !important;
    }
    
    @media (max-width: 350px) {
        font-size: 1.8rem !important;
    }
`

const TimeLabel = styled(Typography)`
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.9rem;
    font-weight: 300;
    background-color: rgba(184, 134, 11, 0.2);
    padding: 0.3rem 0.5rem;
    border-radius: 4px;

    @media (max-width: 768px) {
        font-size: 0.65rem;
        padding: 0.15rem 0.3rem;
        letter-spacing: 1px;
    }
    
    @media (max-width: 350px) {
        font-size: 0.6rem;
        padding: 0.1rem 0.25rem;
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
