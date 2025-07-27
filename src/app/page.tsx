'use client'

import React, { useState, useEffect } from 'react'
import { Box, Container, Typography, Button, CircularProgress, Alert, Modal, Backdrop, Fade, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import Navigation from '../components/Navigation'
import Countdown from '../components/Countdown'
import GhostlyRsvpButton from '../components/GhostlyRsvpButton'
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
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(20, 20, 20, 0.5));
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

const AlertContainer = styled.div`
    margin-top: 1rem;
    width: 100%;
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

    return (
        <HighScoreCard>
            <HighScoreTitle>👑 Current Champion 👑</HighScoreTitle>
            {loading ? <CircularProgress size={24} sx={{ color: '#b8860b' }} /> : error ? <Typography color="error">{error}</Typography> : topScore ? <HighScoreName>{topScore.name}</HighScoreName> : <Typography color="#fff">No scores yet</Typography>}
            <HighScoreValue>
                {topScore?.score.toLocaleString()} <span style={{ color: '#fff', fontSize: '0.8rem' }}>points</span>
            </HighScoreValue>
        </HighScoreCard>
    )
}

export default function Home() {
    const [showHotels, setShowHotels] = useState(false)
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: '',
    })
    const [formStatus, setFormStatus] = useState({
        show: false,
        type: 'success' as 'success' | 'error' | 'info',
        message: '',
    })

    // Modal state for mask examples
    const [modalOpen, setModalOpen] = useState(false)
    const [modalCategory, setModalCategory] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [modalImageCount, setModalImageCount] = useState(6) // Default to 6 images

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setContactForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Modal handlers for mask examples
    // Image counts for each mask category
    const categoryImageCounts: Record<string, number> = {
        venetian: 15,
        filigree: 21,
        feathered: 18,
        gothic: 12,
        bejeweled: 16,
        minimalist: 12,
        couples: 7,
        nature: 9,
        artistic: 24,
    }

    const handleOpenModal = (category: string, title: string) => {
        setModalCategory(category)
        setModalTitle(title)
        setModalImageCount(categoryImageCounts[category] || 6) // Set image count based on category
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
    }

    const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            // Create email content from form data
            const subject = encodeURIComponent('Wedding Website Contact Form')
            const body = encodeURIComponent(`Name: ${contactForm.name}\n\n` + `Email: ${contactForm.email}\n\n` + `Message:\n${contactForm.message}\n\n` + `Sent from: Wedding Website Contact Form`)

            // Email address to send to
            const emailTo = 'constantinec84@gmail.com' // Replace with your preferred email

            // Create mailto link
            const mailtoLink = `mailto:${emailTo}?subject=${subject}&body=${body}`

            // Open email client
            window.location.href = mailtoLink

            // Reset form
            setContactForm({
                name: '',
                email: '',
                message: '',
            })

            // Show success message
            setFormStatus({
                show: true,
                type: 'success',
                message: 'Email client opened! Please send the email from your email application.',
            })

            // Hide success message after 8 seconds
            setTimeout(() => {
                setFormStatus((prev) => ({ ...prev, show: false }))
            }, 8000)
        } catch (error) {
            console.error('Error opening email client:', error)
            setFormStatus({
                show: true,
                type: 'error',
                message: 'Failed to open email client. Please try again or contact us directly.',
            })
        }
    }
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
                                backdropFilter: 'blur(4px)',
                                borderRadius: '16px',
                                padding: { xs: '2rem 1.5rem', md: '2rem 4rem' },
                                marginTop: { xs: '20px', md: '80px' },
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
                            <GhostlyRsvpButton />
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
                                <Image
                                    src="/couple.jpg"
                                    alt="Constantine and Lauren"
                                    width={800}
                                    height={600}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                    }}
                                    priority
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
                    <Image src="/manor.jpg" alt="Westbury Manor" fill style={{ objectFit: 'cover' }} />
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
                                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                                gap: 2,
                                mt: 5,
                                width: '100%',
                                maxWidth: '900px',
                                mx: 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(184, 134, 11, 0.3)',
                                    borderRadius: 2,
                                    padding: 2,
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
                                        width: 60,
                                        height: 60,
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
                                    padding: 2,
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
                                        width: 60,
                                        height: 60,
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
                                    padding: 2,
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
                                        width: 60,
                                        height: 60,
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
                                    padding: 2,
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
                                        width: 60,
                                        height: 60,
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
                        <Box
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                borderRadius: '8px',
                                padding: '2rem',
                                width: '100%',
                                maxWidth: '1200px',
                                margin: '0 auto',
                            }}
                        >
                            <GoldText variant="h2" gutterBottom>
                                Accommodations
                            </GoldText>
                            <Typography variant="body1" sx={{ mb: 4, color: 'white' }}>
                                For your convenience, we&apos;ve compiled a list of nearby hotels to ensure a comfortable stay during our Halloween night wedding at Westbury Manor. While we haven&apos;t reserved room blocks, these accommodations are in close proximity to our venue:
                            </Typography>

                            <Button
                                variant="outlined"
                                onClick={() => setShowHotels(!showHotels)}
                                sx={{
                                    mb: 3,
                                    color: '#D4AF37',
                                    borderColor: '#D4AF37',
                                    '&:hover': {
                                        borderColor: '#D4AF37',
                                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                    },
                                }}
                            >
                                {showHotels ? 'Hide Accommodations' : 'Show Accommodations'}
                            </Button>

                            {showHotels && (
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 4 } }}>
                                    {/* Hotel Cards */}
                                    <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                                            <Image src="/hotels/hiltongardeninnwestbury.jpg" alt="Hilton Garden Inn (Westbury)" fill style={{ objectFit: 'cover' }} />
                                        </Box>
                                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                                Hilton Garden Inn (Westbury)
                                            </Typography>
                                            <Typography variant="body2" paragraph sx={{ mb: 3, flexGrow: 1 }}>
                                                Located approximately 0.7 miles from Westbury Manor, this hotel offers modern amenities including an indoor pool, fitness center, and on-site dining. It&apos;s within walking distance to various shops and restaurants.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                href="https://www.hilton.com/en/hotels/jfkwegi-hilton-garden-inn-westbury/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fullWidth
                                                sx={{
                                                    mt: 'auto',
                                                    color: '#D4AF37',
                                                    borderColor: '#D4AF37',
                                                    '&:hover': {
                                                        borderColor: '#D4AF37',
                                                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                                    },
                                                }}
                                            >
                                                Learn More
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                                            <Image src="/hotels/courtyardmarriott.webp" alt="Courtyard by Marriott" fill style={{ objectFit: 'cover' }} />
                                        </Box>
                                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                                Courtyard by Marriott
                                            </Typography>
                                            <Typography variant="body2" paragraph sx={{ mb: 3, flexGrow: 1 }}>
                                                Located about 1.2 miles from our venue, this hotel provides a comfortable stay with modern amenities and a convenient location.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                href="https://www.marriott.com/en-us/hotels/nycwb-courtyard-westbury-long-island/overview/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fullWidth
                                                sx={{
                                                    mt: 'auto',
                                                    color: '#D4AF37',
                                                    borderColor: '#D4AF37',
                                                    '&:hover': {
                                                        borderColor: '#D4AF37',
                                                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                                    },
                                                }}
                                            >
                                                Learn More
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                                            <Image src="/hotels/viana.png" alt="Viana Hotel and Spa" fill style={{ objectFit: 'cover' }} />
                                        </Box>
                                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                                Viana Hotel and Spa
                                            </Typography>
                                            <Typography variant="body2" paragraph sx={{ mb: 3, flexGrow: 1 }}>
                                                Approximately 1.5 miles from Westbury Manor, this boutique hotel features luxury accommodations, a full-service spa, and the Marco Polo restaurant, blending East and West cuisines.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                href="https://www.vianahotelandspa.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fullWidth
                                                sx={{
                                                    mt: 'auto',
                                                    color: '#D4AF37',
                                                    borderColor: '#D4AF37',
                                                    '&:hover': {
                                                        borderColor: '#D4AF37',
                                                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                                    },
                                                }}
                                            >
                                                Learn More
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                                            <Image src="/hotels/homewood.png" alt="Homewood Suites by Hilton" fill style={{ objectFit: 'cover' }} />
                                        </Box>
                                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                                Homewood Suites by Hilton
                                            </Typography>
                                            <Typography variant="body2" paragraph sx={{ mb: 3, flexGrow: 1 }}>
                                                Located around 1.7 miles from the venue, this all-suite hotel offers extended-stay accommodations with in-room kitchens, complimentary breakfast, and an indoor pool.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                href="https://www.hilton.com/en/hotels/jfkcphw-homewood-suites-carle-place-garden-city-ny/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fullWidth
                                                sx={{
                                                    mt: 'auto',
                                                    color: '#D4AF37',
                                                    borderColor: '#D4AF37',
                                                    '&:hover': {
                                                        borderColor: '#D4AF37',
                                                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                                    },
                                                }}
                                            >
                                                Learn More
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                                            <Image src="/hotels/tapestry.png" alt="The Roslyn, Tapestry Collection by Hilton" fill style={{ objectFit: 'cover' }} />
                                        </Box>
                                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                                The Roslyn, Tapestry Collection by Hilton
                                            </Typography>
                                            <Typography variant="body2" paragraph sx={{ mb: 3, flexGrow: 1 }}>
                                                Situated approximately 4.6 miles from Westbury Manor, this hotel provides elegant rooms, an on-site restaurant, and easy access to local attractions.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                href="https://www.hilton.com/en/hotels/lgarsup-the-roslyn/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fullWidth
                                                sx={{
                                                    mt: 'auto',
                                                    color: '#D4AF37',
                                                    borderColor: '#D4AF37',
                                                    '&:hover': {
                                                        borderColor: '#D4AF37',
                                                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                                    },
                                                }}
                                            >
                                                Learn More
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                                            <Image src="/hotels/hiltongardeninnroslyn.png" alt="Hilton Garden Inn (Roslyn)" fill style={{ objectFit: 'cover' }} />
                                        </Box>
                                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                                Hilton Garden Inn (Roslyn)
                                            </Typography>
                                            <Typography variant="body2" paragraph sx={{ mb: 3, flexGrow: 1 }}>
                                                About 5.2 miles from the venue, this hotel offers comfortable accommodations, an indoor pool, and on-site dining facilities.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                href="https://www.hilton.com/en/hotels/nycpwgi-hilton-garden-inn-roslyn/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fullWidth
                                                sx={{
                                                    mt: 'auto',
                                                    color: '#D4AF37',
                                                    borderColor: '#D4AF37',
                                                    '&:hover': {
                                                        borderColor: '#D4AF37',
                                                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                                    },
                                                }}
                                            >
                                                Learn More
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                            <Typography variant="body1" sx={{ mt: 4, color: 'white' }}>
                                We recommend booking your accommodations early, as our wedding date coincides with Halloween festivities, and local hotels may experience higher demand. For additional options and real-time availability, consider visiting Hotels.com or Expedia. If you have any
                                questions or need further assistance with accommodations, please don&apos;t hesitate to contact us.
                            </Typography>
                        </Box>
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
                                Your mask is an opportunity to pair with your attire. Here are some styles of masks for inspiration:
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                                {/* Card 1 */}
                                <MasqueradeCard>
                                    {/* Venetian mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/venetian/venetian12.jpg"
                                            alt="Classic Venetian Mask"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Classic Venetian Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Intricate and timeless designs, adorned with accents and elegant shapes.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('venetian', 'Classic Venetian Masks')}
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
                                    {/* Filigree mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/filigree/filigree18.jpg"
                                            alt="Filigree Metal Mask"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Filigree Metal Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Delicate, lace-like metalwork with a regal flair and detailed craftsmanship.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('filigree', 'Filigree Metal Masks')}
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
                                    {/* Feathered mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/feathered/feathered04.jpg"
                                            alt="Feathered Mask"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Feathered & Plumed Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Bold designs with feathers or plumes for a dramatic and eye-catching effect.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('feathered', 'Feathered & Plumed Masks')}
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
                                    {/* Gothic mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/gothic/gothic02.jpg"
                                            alt="Dark Gothic Mask"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Dark Gothic Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Skulls, ravens, or baroque elements for a haunting yet elegant aesthetic.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('gothic', 'Dark Gothic Masks')}
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
                                    {/* Bejeweled mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/bejeweled/bejeweled11.jpg"
                                            alt="Bejeweled & Glittering Mask"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Bejeweled & Glittering Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Adorned with crystals, sequins, or rhinestones for a dazzling appearance.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('bejeweled', 'Bejeweled & Glittering Masks')}
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
                                    {/* Minimalist mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/minimalist/minimalist09.jpg"
                                            alt="Minimalist Eye Mask"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Minimalist Eye Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Simple shapes in black, gold, or silver for a sleek and understated statement.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('minimalist', 'Minimalist Eye Masks')}
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
                                {/* Card 7 */}
                                <MasqueradeCard>
                                    {/* Couples mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/couples/couples04.jpg"
                                            alt="Couples Mask"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Couples Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Matching or contrasting designs that share a theme for a coordinated statement.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('couples', 'Couples Masks')}
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
                                {/* Card 8 */}
                                <MasqueradeCard>
                                    {/* Nature mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/nature/nature01.jpg"
                                            alt="Nature-Inspired Mask"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Nature-Inspired Masks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Designs featuring leaves, flowers, or animal motifs for an enchanted forest feel.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('nature', 'Nature-Inspired Masks')}
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
                                {/* Card 9 */}
                                <MasqueradeCard>
                                    {/* Artistic mask image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            mb: 3,
                                            borderRadius: 1,
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src="/mask-categories/artistic/artistic11.jpg"
                                            alt="Artistic Makeup"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority
                                        />
                                    </Box>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 1 }}>
                                            Artistic Makeup
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                                            Bold colors, fine details, or metallic touches for a dramatic, mask-free look.
                                        </Typography>
                                        <Button
                                            onClick={() => handleOpenModal('artistic', 'Artistic Makeup')}
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
                                Check these sites for some of the best masks:
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
                        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', textAlign: 'center', color: 'white' }}>
                            This will be a unique experience, and we can&apos;t wait to see what everyone will come up with!
                        </Typography>
                    </ImageContent>
                </ImageSection>

                <VideoSection id="song-requests">
                    <video autoPlay muted loop playsInline>
                        <source src="/disco.mp4" type="video/mp4" />
                    </video>
                    <SectionVideoOverlay />
                    <VideoContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                        <GoldText variant="h2" gutterBottom>
                            Song Requests
                        </GoldText>
                        <Typography paragraph sx={{ color: 'white', textAlign: 'center' }}>
                            Help us build the ultimate wedding playlist! If there&apos;s a song that will get you on the dance floor, let us know—we want to make sure there&apos;s something for everyone. Whether it&apos;s a classic, a guilty pleasure, or a Halloween-themed banger, we&apos;re taking
                            requests!
                        </Typography>
                        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', gap: 3, '@media (max-width: 900px)': { flexDirection: 'column' } }}>
                            <Box sx={{ width: '100%', maxWidth: '700px' }}>
                                <iframe src="https://open.spotify.com/embed/playlist/7kgTGs1bijkEt0RsOpoYr0" width="100%" height="380" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Wedding Playlist" loading="lazy"></iframe>
                            </Box>
                            <Box sx={{ textAlign: 'center', justifyContent: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#b8860b' }}>
                                    How to Add Songs:
                                </Typography>
                                <Typography paragraph sx={{ color: 'white', textAlign: 'center', fontSize: '1rem' }}>
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
                                    href="https://open.spotify.com/playlist/7kgTGs1bijkEt0RsOpoYr0?si=6f026cae42d04e01&pt=3218ec0e86e820163c61ab5a18099fcd"
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
                        <ContactForm onSubmit={handleContactSubmit}>
                            <StyledInput type="text" name="name" placeholder="Your Name" value={contactForm.name} onChange={handleContactChange} required />
                            <StyledInput type="email" name="email" placeholder="Your Email" value={contactForm.email} onChange={handleContactChange} required />
                            <StyledTextArea name="message" placeholder="Your Message" value={contactForm.message} onChange={handleContactChange} required />
                            <SubmitButton type="submit">Send Message</SubmitButton>
                            {formStatus.show && (
                                <AlertContainer>
                                    <Alert severity={formStatus.type} onClose={() => setFormStatus({ show: false, type: 'success', message: '' })}>
                                        {formStatus.message}
                                    </Alert>
                                </AlertContainer>
                            )}
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

                {/* Mask Examples Modal */}
                <Modal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={modalOpen}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: { xs: '90%', sm: '80%', md: '70%' },
                                maxWidth: 800,
                                maxHeight: '80vh',
                                overflow: 'auto',
                                bgcolor: 'rgba(0, 0, 0, 0.9)',
                                border: '2px solid #D4AF37',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: 2,
                            }}
                        >
                            <IconButton
                                onClick={handleCloseModal}
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    left: 10,
                                    color: '#D4AF37',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        color: '#cd7f32',
                                    },
                                    zIndex: 10,
                                }}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h5" sx={{ color: '#D4AF37', mb: 2, textAlign: 'center' }}>
                                {modalTitle} Ideas
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                                {/* Display all available images from the mask-categories folders */}
                                {Array.from({ length: modalImageCount }).map((_, index) => {
                                    const imageNumber = (index + 1).toString().padStart(2, '0')
                                    const imagePath = `/mask-categories/${modalCategory}/${modalCategory}${imageNumber}.jpg`

                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                height: 200,
                                                backgroundColor: 'rgba(50, 50, 50, 0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 1,
                                                border: '1px solid rgba(184, 134, 11, 0.3)',
                                                overflow: 'hidden',
                                                position: 'relative',
                                            }}
                                        >
                                            <Image
                                                src={imagePath}
                                                alt={`${modalTitle} example ${index + 1}`}
                                                fill
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                                priority={index < 3} // Prioritize loading the first 3 images
                                            />
                                        </Box>
                                    )
                                })}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    onClick={handleCloseModal}
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
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </PageWrapper>
    )
}
