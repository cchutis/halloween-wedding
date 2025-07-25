'use client'

import React, { useState, useEffect } from 'react'
import { Box, Button, Container, Typography, CircularProgress, Alert } from '@mui/material'
import styled, { keyframes } from 'styled-components'
import Navigation from '../components/Navigation'
import Countdown from '../components/Countdown'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { getTopScores, LeaderboardScore } from '@/lib/leaderboard'

// Import ImageCarousel dynamically with SSR disabled to prevent hydration errors
const ImageCarousel = dynamic(() => import('../components/ImageCarousel'), {
    ssr: false,
    loading: () => (
        <Box sx={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: '#D4AF37' }}>Loading photos...</Typography>
        </Box>
    ),
})

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rem 2rem;
    scroll-snap-align: start;
    position: relative;
    overflow-y: auto;

    @media (max-width: 768px) {
        padding: 4rem 1rem;
    }

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(184, 134, 11, 0.3);
        border-radius: 4px;
    }
`

const HeroSection = styled(Section)`
    height: 100vh;
    min-height: 100vh;
    align-items: center;
    overflow: hidden;
    color: white;
    text-align: center;
    padding: 0;
    position: relative;

    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.5;
        filter: contrast(1.1) brightness(0.7);
    }

    & > * {
        position: relative;
        z-index: 2;
    }
`

const VideoOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(20, 20, 20, 0.7));
    z-index: 1;
`
const HoneyfundLink = styled.a`
    display: inline-block;
    background-color: rgba(184, 134, 11, 0.8);
    color: white;
    padding: 16px 32px;
    border-radius: 30px;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
        background-color: rgba(205, 127, 50, 0.9);
        transform: translateY(-2px);
        color: white;
    }
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoldText = styled((props: any) => <Typography component="h1" {...props} />)`
    color: #b8860b;
    padding-bottom: 1rem;

    @media (max-width: 768px) {
        font-size: 2rem !important;
    }
`

const ContactSection = styled(Box)`
    padding: 6rem 0;
    background-image: url('/moon.jpg');
    background-size: fill;
    background-position: 50%;
    color: #b8860b;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    scroll-snap-align: start;
    position: relative;
`

const ContactContainer = styled(Container)`
    flex: 1;
    padding-bottom: 6rem;
    position: relative;
    z-index: 2;
`

const ContactForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 8px;

    @media (max-width: 768px) {
        padding: 1rem;
        margin: 0 1rem;
    }
`

const StyledInput = styled.input`
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid #b8860b;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 1rem;

    @media (max-width: 768px) {
        font-size: 16px; /* Prevents iOS zoom on focus */
    }

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
        outline: none;
        border-color: #cd7f32;
        box-shadow: 0 0 0 2px rgba(205, 127, 50, 0.2);
    }
`

const StyledTextArea = styled.textarea`
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid #b8860b;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 1rem;
    min-height: 150px;
    resize: vertical;

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
        outline: none;
        border-color: #cd7f32;
        box-shadow: 0 0 0 2px rgba(205, 127, 50, 0.2);
    }
`

const SubmitButton = styled.button`
    padding: 1rem 2rem;
    background-color: #b8860b;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #cd7f32;
    }
`

const MasqueradeCard = styled(Box)`
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    border: 1px solid rgba(184, 134, 11, 0.5);
    padding: 1.5rem;
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #b8860b, #d4af37, #b8860b);
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
`

const AnimatedBox = styled.div`
    text-align: center;
    margin-bottom: 3rem;
    animation: ${fadeIn} 1s ease-out;
`

const Footer = styled.footer`
    background-color: black;
    color: white;
    text-align: center;
    padding: 2rem 0;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
`

const PageWrapper = styled.div`
    scroll-snap-type: y proximity;
    overflow-y: auto;
    height: 100vh;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(184, 134, 11, 0.3);
        border-radius: 4px;
    }
`

const VideoSection = styled(Section)`
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.5;
    }

    @media (max-width: 768px) {
        padding-top: 4rem;
        padding-bottom: 4rem;
    }
`

const SectionVideoOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 2;
`

const VideoContent = styled(Container)`
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
`

const ImageSection = styled(Section)`
    position: relative;
    overflow: hidden;
    color: white;
    background-image: url('/rest.jpg');
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        padding-top: 6rem;
        padding-bottom: 6rem;
    }
`

const ImageOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 1;
`

const ImageContent = styled(Container)`
    position: relative;
    z-index: 2;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 1rem;
        overflow-x: hidden;
    }
`

const GameButtonSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top: 1rem;
    width: 100%;
`

const MobileGameMessage = styled.div`
    display: none;
    color: #ff9800;
    text-align: center;
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ff9800;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
        display: block;
    }
`

const HighScoreCard = styled.div`
    background-color: rgba(0, 0, 0, 0.7);
    border: 2px solid #b8860b;
    border-radius: 8px;
    padding: 1rem 2rem;
    text-align: center;
    color: white;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    animation: ${fadeIn} 0.5s ease-in-out;
`

const HighScoreTitle = styled.h3`
    color: #b8860b;
    font-size: 1.2rem;
`

const HighScoreName = styled.span`
    color: #fff;
    font-weight: bold;
    font-size: 1.3rem;
`

const HighScoreValue = styled.span`
    color: #cd7f32;
    font-weight: bold;
    font-size: 1.5rem;
    margin-left: 0.5rem;
`

// High Score Display Component
const HighScoreDisplay = () => {
    const [topScore, setTopScore] = useState<LeaderboardScore | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTopScore = async () => {
            try {
                setLoading(true)
                const scores = await getTopScores(1)
                if (scores && scores.length > 0) {
                    setTopScore(scores[0])
                }
            } catch (err) {
                console.error('Failed to load top score:', err)
                setError('Failed to load top score')
                // Fallback to mock data
                setTopScore({
                    name: 'Bella',
                    score: 3,
                    date: '2024-10-31',
                })
            } finally {
                setLoading(false)
            }
        }

        fetchTopScore()
    }, [])

    if (loading) {
        return (
            <HighScoreCard>
                <CircularProgress size={24} style={{ color: '#b8860b' }} />
                <Typography variant="body2" sx={{ mt: 1, color: '#b8860b' }}>
                    Loading top score...
                </Typography>
            </HighScoreCard>
        )
    }

    if (error && !topScore) {
        return (
            <HighScoreCard>
                <Alert severity="warning" sx={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#b8860b' }}>
                    {error}
                </Alert>
            </HighScoreCard>
        )
    }

    return (
        <HighScoreCard>
            <HighScoreTitle>👑 Current Champion 👑</HighScoreTitle>
            <HighScoreName>{topScore?.name}</HighScoreName>
            <HighScoreValue>
                {topScore?.score.toLocaleString()} <span style={{ color: '#fff', fontSize: '0.8rem' }}>points</span>
            </HighScoreValue>
        </HighScoreCard>
    )
}

export default function Home() {
    return (
        <PageWrapper>
            <Box>
                <Navigation />
                <HeroSection id="hero">
                    <VideoOverlay />
                    <video autoPlay muted loop playsInline>
                        <source src="/roses.mp4" type="video/mp4" />
                    </video>
                    <Container
                        maxWidth="lg"
                        sx={{
                            zIndex: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            position: 'relative',
                            padding: { xs: '1rem', md: '2rem' },
                        }}
                    >
                        <Box
                            sx={{
                                background: 'rgba(0,0,0,0.4)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '16px',
                                padding: { xs: '2rem 1.5rem', md: '3rem 4rem' },
                                border: '1px solid rgba(184, 134, 11, 0.3)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 8px rgba(184, 134, 11, 0.2)',
                                width: { xs: '95%', sm: '85%', md: 'auto' },
                                maxWidth: '800px',
                                animation: 'fadeIn 1.5s ease-out',
                                '@keyframes fadeIn': {
                                    from: { opacity: 0, transform: 'translateY(10px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            <GoldText
                                variant="h1"
                                gutterBottom
                                sx={{
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                    fontWeight: 500,
                                    letterSpacing: '1px',
                                }}
                            >
                                Constantine & Lauren
                            </GoldText>
                            <Typography
                                variant="h3"
                                gutterBottom
                                sx={{
                                    color: '#CD7F32',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                    letterSpacing: '2px',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                October 31st, 2025
                            </Typography>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    color: 'white',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                                    fontWeight: 300,
                                    letterSpacing: '3px',
                                    marginBottom: '2rem',
                                }}
                            >
                                A Halloween Masquerade Wedding
                            </Typography>
                            <Countdown />
                        </Box>
                    </Container>
                </HeroSection>

                <ImageSection id="about" style={{ backgroundImage: `url('/candle.jpg')`, backgroundPosition: 'top' }}>
                    <ImageOverlay />
                    <ImageContent>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 3, md: 4 },
                                width: '100%',
                                maxWidth: '1200px',
                                margin: '0 auto',
                                flexDirection: { xs: 'column', md: 'row' },
                                overflow: 'visible',
                            }}
                        >
                            <Box
                                sx={{
                                    flex: { xs: '0 0 auto', md: '0 0 400px' },
                                    width: { xs: '80%', sm: '70%', md: 'auto' },
                                    maxWidth: { xs: '300px', sm: '350px', md: '400px' },
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    padding: 2,
                                    borderRadius: 2,
                                    margin: { xs: '0 auto', md: 0 },
                                }}
                            >
                                <img
                                    src="./couple.jpg"
                                    alt="Constantine and Lauren"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: 2,
                                        maxHeight: '400px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                    padding: { xs: '1rem', md: '0 2rem 0 0' },
                                    width: { xs: '100%', md: 'auto' },
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    backgroundColor: { xs: 'rgba(0,0,0,0.6)', md: 'transparent' },
                                    borderRadius: { xs: 2, md: 0 },
                                }}
                            >
                                <GoldText variant="h2" gutterBottom sx={{ textAlign: { xs: 'center', md: 'left' }, mt: { xs: 2, md: 0 } }}>
                                    Our Wedding
                                </GoldText>
                                <Typography paragraph sx={{ color: 'white' }}>
                                    We&apos;re getting married on Halloween, and we&apos;re really glad you&apos;re here.
                                </Typography>
                                <Typography paragraph sx={{ color: 'white' }}>
                                    The wedding will take place at a historic mansion on Long Island. Since it&apos;s Halloween, we&apos;re leaning into the spirit of the day with a masquerade-style celebration.
                                </Typography>
                                <Typography paragraph sx={{ color: 'white' }}>
                                    It&apos;ll be a mix of elegance, fun, and a little mystery. Masks are strongly encouraged. This site has all the details you&apos;ll need, including the schedule, dress code, accommodations, and more.
                                </Typography>
                                <Typography paragraph sx={{ color: 'white' }}>
                                    Thanks for being part of this with us. We can&apos;t wait to celebrate together.
                                </Typography>

                                {/* Image Carousel - Client-side only rendering */}
                                <Box
                                    sx={{
                                        mt: 4,
                                        width: '100%',
                                        height: { xs: '180px', sm: '220px', md: '280px' },
                                        overflow: 'hidden',
                                        borderRadius: 1,
                                    }}
                                >
                                    <ImageCarousel
                                        images={[
                                            { src: '/couple-photos/photo01.jpg', alt: 'Constantine and Lauren' },
                                            { src: '/couple-photos/photo02.jpg', alt: 'Constantine and Lauren' },
                                            { src: '/couple-photos/photo03.jpg', alt: 'Constantine and Lauren' },
                                            { src: '/couple-photos/photo04.jpg', alt: 'Constantine and Lauren' },
                                            // { src: '/couple-photos/photo05.jpg', alt: 'Constantine and Lauren' },
                                            // { src: '/couple-photos/photo06.jpg', alt: 'Constantine and Lauren' },
                                            { src: '/couple-photos/photo07.jpg', alt: 'Constantine and Lauren' },
                                            { src: '/couple-photos/photo08.jpg', alt: 'Constantine and Lauren' },
                                            // { src: '/couple-photos/photo09.jpg', alt: 'Constantine and Lauren' },
                                            // { src: '/couple-photos/photo10.jpg', alt: 'Constantine and Lauren' },
                                        ]}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </ImageContent>
                </ImageSection>

                <VideoSection id="when-where">
                    <video autoPlay muted loop playsInline>
                        <source src="https://www.westburymanor.com/background-videos/photos/Exteriors_720.mp4" type="video/mp4" />
                    </video>
                    <SectionVideoOverlay />
                    <VideoContent>
                        <GoldText variant="h2" gutterBottom>
                            When & Where
                        </GoldText>
                        <Typography paragraph sx={{ color: 'white' }}>
                            Westbury Manor is a historic estate on Long Island with a mix of indoor and outdoor spaces that fit the vibe of our Halloween wedding. The grounds have quiet garden paths, fountains, and just enough atmosphere for the occasion.
                            <br /> <br />
                            Please gather at the venue at 6:30 PM. Cocktail hour will follow the ceremony and flow between the gardens and the manor before we head inside for dinner and dancing in the grand ballroom.
                        </Typography>
                        <a href="https://www.westburymanor.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                            Learn more about the venue here
                        </a>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                                gap: 3,
                                mt: 5,
                                width: '100%',
                                maxWidth: '1200px',
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(184, 134, 11, 0.3)',
                                    borderRadius: 2,
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(184, 134, 11, 0.2)',
                                        borderRadius: '50%',
                                        width: 70,
                                        height: 70,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h4" sx={{ color: '#D4AF37' }}>
                                        <span role="img" aria-label="calendar">
                                            📅
                                        </span>
                                    </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ color: '#D4AF37', mb: 1 }}>
                                    Date
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    October 31st, 2025
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                                    Halloween Night
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(184, 134, 11, 0.3)',
                                    borderRadius: 2,
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(184, 134, 11, 0.2)',
                                        borderRadius: '50%',
                                        width: 70,
                                        height: 70,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h4" sx={{ color: '#D4AF37' }}>
                                        <span role="img" aria-label="clock">
                                            ⏰
                                        </span>
                                    </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ color: '#D4AF37', mb: 1 }}>
                                    Time
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Please arrive at
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
                                    6:30 PM
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(184, 134, 11, 0.3)',
                                    borderRadius: 2,
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(184, 134, 11, 0.2)',
                                        borderRadius: '50%',
                                        width: 70,
                                        height: 70,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h4" sx={{ color: '#D4AF37' }}>
                                        <span role="img" aria-label="location">
                                            📍
                                        </span>
                                    </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ color: '#D4AF37', mb: 1 }}>
                                    Location
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    Westbury Manor
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                                    Westbury, NY
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(184, 134, 11, 0.3)',
                                    borderRadius: 2,
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(184, 134, 11, 0.2)',
                                        borderRadius: '50%',
                                        width: 70,
                                        height: 70,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h4" sx={{ color: '#D4AF37' }}>
                                        <span role="img" aria-label="dress">
                                            👗
                                        </span>
                                    </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ color: '#D4AF37', mb: 1 }}>
                                    Attire
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    Formal Masquerade
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                                    Masks encouraged
                                </Typography>
                            </Box>
                        </Box>
                    </VideoContent>
                </VideoSection>

                {/* <Section id="wedding-party" style={{ backgroundColor: '#1C1C1C' }}>
                    <Container>
                        <GoldText variant="h2" gutterBottom>
                            Wedding Party
                        </GoldText>
                        <Typography paragraph>We can&apos;t wait to introduce you to the incredible friends and family standing by our side on our big day! Each of them has played a special role in our journey, and we&apos;re so grateful to have them celebrating with us.</Typography>
                        <Typography paragraph>Check back soon for a sneak peek at our wedding party, complete with photos, fun bios, and maybe even a little insider scoop on how we met each of them.</Typography>
                    </Container>
                </Section> */}

                <ImageSection id="hotels">
                    <ImageOverlay />
                    <ImageContent>
                        <GoldText variant="h2" gutterBottom>
                            Accommodations
                        </GoldText>
                        <Typography variant="body1" sx={{ mb: 4, color: 'white' }}>
                            For your convenience, we&apos;ve compiled a list of nearby hotels to ensure a comfortable stay during our Halloween night wedding at Westbury Manor. While we haven&apos;t reserved room blocks, these accommodations are in close proximity to our venue:
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 4 } }}>
                            {/* Hotel Cards */}
                            <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Hilton Garden Inn (Westbury)
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                                        <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}>
                                            <Image src="/hotels/hiltongardeninnwestbury.jpg" alt="Hilton Garden Inn (Westbury)" width={150} height={150} style={{ objectFit: 'cover', borderRadius: 5 }} />
                                        </Box>
                                        <Typography variant="body2" paragraph>
                                            Located approximately 0.7 miles from Westbury Manor, this hotel offers modern amenities including an indoor pool, fitness center, and on-site dining. It&apos;s within walking distance to various shops and restaurants.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" href="https://www.hilton.com/en/hotels/jfkwegi-hilton-garden-inn-westbury/" target="_blank" rel="noopener noreferrer">
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Courtyard by Marriott
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                                        <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}>
                                            <Image src="/hotels/courtyardmarriott.webp" alt="Courtyard by Marriott" width={150} height={150} style={{ objectFit: 'cover', borderRadius: 5 }} />
                                        </Box>
                                        <Typography variant="body2" paragraph>
                                            Situated about 0.8 miles from the venue, this hotel provides contemporary rooms, an indoor pool, and a fitness center. Guests can enjoy easy access to nearby attractions and dining options.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" href="https://www.marriott.com/en-us/hotels/nycbl-courtyard-westbury-long-island-ny/" target="_blank" rel="noopener noreferrer">
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Viana Hotel and Spa
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                                        <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}>
                                            <Image src="/hotels/viana.png" alt="Viana Hotel and Spa" width={150} height={150} style={{ objectFit: 'cover', borderRadius: 5 }} />
                                        </Box>
                                        <Typography variant="body2" paragraph>
                                            Approximately 1.5 miles from Westbury Manor, this boutique hotel features luxury accommodations, a full-service spa, and the Marco Polo restaurant, blending East and West cuisines.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" href="https://www.vianahotelandspa.com/" target="_blank" rel="noopener noreferrer">
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Homewood Suites by Hilton
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                                        <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}>
                                            <Image src="/hotels/homewood.png" alt="Homewood Suites by Hilton" width={150} height={150} style={{ objectFit: 'cover', borderRadius: 5 }} />
                                        </Box>
                                        <Typography variant="body2" paragraph>
                                            Located around 1.7 miles from the venue, this all-suite hotel offers extended-stay accommodations with in-room kitchens, complimentary breakfast, and an indoor pool.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" href="https://www.hilton.com/en/hotels/jfkcphw-homewood-suites-carle-place-garden-city-ny/" target="_blank" rel="noopener noreferrer">
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        The Roslyn, Tapestry Collection by Hilton
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                                        <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}>
                                            <Image src="/hotels/tapestry.png" alt="The Roslyn, Tapestry Collection by Hilton" width={150} height={150} style={{ objectFit: 'cover', borderRadius: 5 }} />
                                        </Box>
                                        <Typography variant="body2" paragraph>
                                            Situated approximately 4.6 miles from Westbury Manor, this hotel provides elegant rooms, an on-site restaurant, and easy access to local attractions.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" href="https://www.hilton.com/en/hotels/lgarsup-the-roslyn/" target="_blank" rel="noopener noreferrer">
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Hilton Garden Inn (Roslyn)
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                                        <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}>
                                            <Image src="/hotels/hiltongardeninnroslyn.png" alt="Hilton Garden Inn (Roslyn)" width={150} height={150} style={{ objectFit: 'cover', borderRadius: 5 }} />
                                        </Box>
                                        <Typography variant="body2" paragraph>
                                            About 5.2 miles from the venue, this hotel offers comfortable accommodations, an indoor pool, and on-site dining facilities.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" href="https://www.hilton.com/en/hotels/nycpwgi-hilton-garden-inn-roslyn/" target="_blank" rel="noopener noreferrer">
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 4, color: 'white' }}>
                            We recommend booking your accommodations early, as our wedding date coincides with Halloween festivities, and local hotels may experience higher demand. For additional options and real-time availability, consider visiting Hotels.com or Expedia. If you have any questions
                            or need further assistance with accommodations, please don&apos;t hesitate to contact us.
                        </Typography>
                    </ImageContent>
                </ImageSection>

                <ImageSection id="masquerade" style={{ backgroundImage: `url('/masks.jpg')`, backgroundPosition: 'center' }}>
                    <ImageOverlay />
                    <ImageContent>
                        <AnimatedBox>
                            <GoldText variant="h2" gutterBottom>
                                Masquerade Details
                            </GoldText>

                            <Box
                                sx={{
                                    maxWidth: '800px',
                                    margin: '0 auto',
                                    p: 3,
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(184, 134, 11, 0.3)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                }}
                            >
                                <Typography variant="body1" sx={{ color: 'white', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                    A masquerade wedding on Halloween night feels like the perfect kind of magic. We&apos;re drawing inspiration from Venetian-style masquerade balls, where masks bring a sense of mystery and celebration. Whether your mask is simple, dramatic, or a little spooky, it
                                    will add to the atmosphere and make the night even more unforgettable.
                                </Typography>
                            </Box>
                        </AnimatedBox>
                        {/* History Section - Card Layout */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 5 }}>
                            <MasqueradeCard sx={{ flex: 1 }}>
                                <GoldText variant="h4" sx={{ mb: 2 }}>
                                    A Brief History of Masquerades
                                </GoldText>
                                <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
                                    Masquerade balls began in <strong>15th-century Venice</strong>, where elaborate masks allowed guests to revel in anonymity and grandeur. Over time, they became symbols of <strong>romance, mystery, and opulence</strong>, spreading across Europe and influencing
                                    celebrations worldwide.
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    On <strong>Halloween night</strong>, masks blend theatrical beauty with the playful, mysterious spirit of the season.
                                </Typography>
                            </MasqueradeCard>
                        </Box>
                        {/* Mask Ideas Section */}
                        <Box sx={{ mb: 5 }}>
                            <GoldText variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
                                Mask Ideas & Inspiration
                            </GoldText>

                            <Typography variant="body1" paragraph sx={{ color: 'white', textAlign: 'center', mb: 4, maxWidth: '800px', mx: 'auto' }}>
                                Your mask is an opportunity to <strong>express your personal style</strong> while embracing the theme. Here are a few ideas:
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                                {/* Card 1 */}
                                <MasqueradeCard>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Classic Venetian Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Intricate, timeless, and adorned with metallic accents.
                                        </Typography>
                                        <Button
                                            href="https://www.etsy.com/search?q=venetian+masquerade+mask"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                            }}
                                        >
                                            View Examples
                                        </Button>
                                    </Box>
                                </MasqueradeCard>

                                {/* Card 2 */}
                                <MasqueradeCard>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Filigree Metal Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Delicate, lace-like designs with a regal touch.
                                        </Typography>
                                        <Button
                                            href="https://www.masqueradestore.com/collections/women-lace-masks"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                            }}
                                        >
                                            View Examples
                                        </Button>
                                    </Box>
                                </MasqueradeCard>

                                {/* Card 3 */}
                                <MasqueradeCard>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Feathered & Plumed Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Bold and dramatic for a statement look.
                                        </Typography>
                                        <Button
                                            href="https://www.simplymasquerade.co.uk/masqueradeshop/cat_50367-Feather-Masks.html"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                            }}
                                        >
                                            View Examples
                                        </Button>
                                    </Box>
                                </MasqueradeCard>

                                {/* Card 4 */}
                                <MasqueradeCard>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Dark Gothic Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Skulls, ravens, or baroque-inspired designs for a hauntingly beautiful effect.
                                        </Typography>
                                        <Button
                                            href="https://www.etsy.com/search?q=gothic+masquerade+mask"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                            }}
                                        >
                                            View Examples
                                        </Button>
                                    </Box>
                                </MasqueradeCard>

                                {/* Card 5 */}
                                <MasqueradeCard>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Minimalist Eye Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Sleek black, gold, or silver for effortless elegance.
                                        </Typography>
                                        <Button
                                            href="https://www.masqueradestore.com/simple-eye-masks"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                            }}
                                        >
                                            View Examples
                                        </Button>
                                    </Box>
                                </MasqueradeCard>

                                {/* Card 6 */}
                                <MasqueradeCard>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Artistic Makeup
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Intricate designs, bold colors, or metallic accents for a dramatic and mask-free look.
                                        </Typography>
                                        <Button
                                            href="https://www.etsy.com/search?q=gothic+masquerade+mask"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                            }}
                                        >
                                            View Examples
                                        </Button>
                                    </Box>
                                </MasqueradeCard>
                            </Box>
                        </Box>

                        {/* Where to Find Section */}
                        <Box sx={{ mb: 5 }}>
                            <GoldText variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
                                Where to Find a High-Quality Mask
                            </GoldText>

                            <Typography variant="body1" paragraph sx={{ color: 'white', textAlign: 'center', mb: 4, maxWidth: '800px', mx: 'auto' }}>
                                Skip the Mardi Gras styles—here&apos;s where to find elegant, high-quality masks:
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
                                {/* Shop 1 */}
                                <MasqueradeCard>
                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 2 }}>
                                            Etsy
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 3, flex: 1 }}>
                                            Handmade, customizable, and unique.
                                        </Typography>
                                        <Button
                                            href="https://www.etsy.com/search?q=masquerade+mask"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                                width: '100%',
                                            }}
                                        >
                                            Visit Shop
                                        </Button>
                                    </Box>
                                </MasqueradeCard>

                                {/* Shop 2 */}
                                <MasqueradeCard>
                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 2 }}>
                                            The Venetian Mask Society
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 3, flex: 1 }}>
                                            Authentic Venetian masks crafted in Italy.
                                        </Typography>
                                        <Button
                                            href="https://www.venetianmasksociety.com/"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                                width: '100%',
                                            }}
                                        >
                                            Visit Shop
                                        </Button>
                                    </Box>
                                </MasqueradeCard>

                                {/* Shop 3 */}
                                <MasqueradeCard>
                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 2 }}>
                                            Simply Masquerade
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 3, flex: 1 }}>
                                            Luxury filigree and hand-painted designs.
                                        </Typography>
                                        <Button
                                            href="https://www.simplymasquerade.co.uk/"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                                width: '100%',
                                            }}
                                        >
                                            Visit Shop
                                        </Button>
                                    </Box>
                                </MasqueradeCard>

                                {/* Shop 4 */}
                                <MasqueradeCard>
                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 2 }}>
                                            Amazon
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 3, flex: 1 }}>
                                            A mix of quality and convenience with fast shipping.
                                        </Typography>
                                        <Button
                                            href="https://www.amazon.com/s?k=masquerade+mask"
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: '#D4AF37',
                                                borderColor: '#D4AF37',
                                                '&:hover': {
                                                    borderColor: '#b8860b',
                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                                },
                                                width: '100%',
                                            }}
                                        >
                                            Visit Shop
                                        </Button>
                                    </Box>
                                </MasqueradeCard>
                            </Box>
                        </Box>
                        {/* Tip Box */}
                        <Box
                            sx={{
                                backgroundColor: 'rgba(184, 134, 11, 0.15)',
                                p: 3,
                                borderRadius: 2,
                                mb: 5,
                                border: '1px solid rgba(184, 134, 11, 0.3)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(184, 134, 11, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.8rem',
                                    flexShrink: 0,
                                }}
                            >
                                💡
                            </Box>
                            <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'white' }}>
                                <strong>Tip:</strong> For comfort, opt for a mask that secures with ribbons or elastic rather than a stick-held design. Some even come on glasses frames for all-night wearability!
                            </Typography>
                        </Box>
                        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', textAlign: 'center', color: 'white' }}>
                            We can&apos;t wait to see everyone in their masquerade best—whether it&apos;s dramatic and bold or sleek and mysterious. The only rule? <strong>Have fun with it!</strong>
                        </Typography>
                    </ImageContent>
                </ImageSection>

                <VideoSection id="song-requests">
                    <video autoPlay muted loop playsInline>
                        <source src="/disco.mp4" type="video/mp4" />
                    </video>
                    <SectionVideoOverlay />
                    <VideoContent>
                        <GoldText variant="h2" gutterBottom>
                            Song Requests
                        </GoldText>
                        <Typography paragraph sx={{ color: 'white' }}>
                            Help us build the ultimate wedding playlist! If there&apos;s a song that will get you on the dance floor, let us know—we want to make sure there&apos;s something for everyone. Whether it&apos;s a classic, a guilty pleasure, or a Halloween-themed banger, we&apos;re taking
                            requests!
                        </Typography>
                        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <Box sx={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2 }}>
                                <iframe src="https://open.spotify.com/embed/playlist/7kgTGs1bijkEt0RsOpoYr0" width="100%" height="380" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Wedding Playlist" loading="lazy"></iframe>
                            </Box>
                            <Box sx={{ textAlign: 'center', maxWidth: '600px', backgroundColor: 'rgba(0,0,0,0.6)', p: 4, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#b8860b' }}>
                                    How to Add Songs:
                                </Typography>
                                <Typography paragraph sx={{ color: 'white' }}>
                                    1. Click the Open spotify button below
                                    <br />
                                    2. This will add you as a collaborator on the playlist
                                    <br />
                                    3. You will be able to add songs to the playlist
                                    <br />
                                    4. Once you&apos;ve added a song, it will appear in the playlist
                                    <br />
                                    5. We will pick some songs to play during the reception
                                </Typography>
                                <a
                                    href="https://open.spotify.com/playlist/7kgTGs1bijkEt0RsOpoYr0?si=d1544526443942ec&pt=005ab39bdfebf3feba43f2ba72e8b6f9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: '#1DB954',
                                        color: 'white',
                                        padding: '12px 24px',
                                        borderRadius: '24px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        marginTop: '16px',
                                    }}
                                >
                                    Open in Spotify
                                </a>
                            </Box>
                        </Box>
                    </VideoContent>
                </VideoSection>

                <VideoSection id="game">
                    <video autoPlay muted loop playsInline>
                        <source src="/crt.mp4" type="video/mp4" />
                    </video>
                    <VideoOverlay />
                    <VideoContent maxWidth="lg">
                        <GoldText variant="h2" gutterBottom align="center">
                            👾 Wedding Invaders 👻
                        </GoldText>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#b8860b',
                                textAlign: 'center',
                                marginTop: '2rem',
                                fontStyle: 'italic',
                            }}
                        >
                            Compete against other wedding guests. Top scores will be displayed on the leaderboard.
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#b8860b',
                                textAlign: 'center',
                                marginBottom: '2rem',
                                fontStyle: 'italic',
                            }}
                        >
                            🏆 1st place as of the wedding will receive a trophy! 🏆
                        </Typography>
                        <GameButtonSection>
                            {/* Mobile detection and conditional rendering */}
                            <MobileGameMessage>
                                ⚠️ This game requires a keyboard and is only playable on desktop devices.
                                <br />
                                Please visit this site from a computer to play.
                            </MobileGameMessage>

                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    href="/game"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        backgroundColor: '#b8860b',
                                        color: 'white',
                                        padding: '12px 24px',
                                        fontSize: '1.1rem',
                                        '&:hover': {
                                            backgroundColor: '#cd7f32',
                                        },
                                        '@media (max-width: 768px)': {
                                            opacity: 0.5,
                                            pointerEvents: 'none',
                                            cursor: 'not-allowed',
                                        },
                                    }}
                                >
                                    Play Wedding Invaders
                                </Button>
                            </Box>

                            <HighScoreDisplay />
                        </GameButtonSection>
                    </VideoContent>
                </VideoSection>

                <ImageSection id="honeyfund" style={{ backgroundImage: `url('/travel.jpg')` }}>
                    <ImageOverlay />
                    <ImageContent>
                        <GoldText variant="h2" gutterBottom>
                            Registry: Honeyfund
                        </GoldText>

                        <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                textAlign: 'center',
                                fontSize: '1.1rem',
                                mb: 3,
                                color: 'white',
                            }}
                        >
                            Your presence at our wedding is the greatest gift we could ask for. However, if you&apos;d like to contribute to our honeymoon fund or a special experience, we&apos;ve set up a Honeyfund to make it easy. Instead of a traditional gift registry, we&apos;re inviting guests
                            to help us create unforgettable memories—whether it&apos;s a romantic dinner, an adventurous excursion, or a relaxing spa day.
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <HoneyfundLink href="https://www.honeyfund.com/site/chutis-o-malley-10-31-2025" target="_blank" rel="noopener noreferrer">
                                Visit our Registry
                            </HoneyfundLink>
                        </Box>
                    </ImageContent>
                </ImageSection>

                <ContactSection id="contact">
                    <ImageOverlay />
                    <ContactContainer>
                        <GoldText variant="h2" gutterBottom align="center" sx={{ mt: { xs: 4, md: 2 } }}>
                            Contact Us
                        </GoldText>
                        <Typography paragraph sx={{ color: 'white', textAlign: 'center', mb: 4 }}>
                            Questions about the wedding? Need help with accommodations? Want to share your excitement? We&apos;d love to hear from you! Drop us a message and we&apos;ll get back to you as soon as we can.
                        </Typography>
                        <ContactForm>
                            <StyledInput type="text" placeholder="Your Name" required />
                            <StyledInput type="email" placeholder="Your Email" required />
                            <StyledTextArea placeholder="Your Message" required />
                            <SubmitButton type="submit">Send Message</SubmitButton>
                        </ContactForm>
                    </ContactContainer>
                    <Footer>
                        <Container>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                &copy; 2024 Constantine & Lauren. All rights reserved.
                            </Typography>
                        </Container>
                    </Footer>
                </ContactSection>
            </Box>
        </PageWrapper>
    )
}
