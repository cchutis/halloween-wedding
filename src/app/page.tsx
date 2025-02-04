'use client'

import { Box, Container, Typography } from '@mui/material'
import styled from 'styled-components'
import Navigation from '../components/Navigation'
import Countdown from '../components/Countdown'

const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
`

const HeroSection = styled(Section)`
    position: relative;
    overflow: hidden;
    color: white;
    text-align: center;

    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.4;
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
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1;
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoldText = styled((props: any) => <Typography component="h1" {...props} />)`
    color: #b8860b;
`

const AboutImage = styled.img`
    width: 400px;
    height: 500px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(184, 134, 11, 0.3);
`

const AboutContent = styled(Box)`
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
`

const TextContent = styled(Box)`
    flex: 1;
`

export default function Home() {
    return (
        <Box>
            <Navigation />
            <HeroSection id="hero">
                <VideoOverlay />
                <video autoPlay muted loop playsInline>
                    <source src="/roses.mp4" type="video/mp4" />
                </video>
                <Container sx={{ zIndex: 4 }}>
                    <GoldText variant="h1" gutterBottom>
                        Constantine & Lauren
                    </GoldText>
                    <Typography variant="h3" gutterBottom sx={{ color: '#CD7F32' }}>
                        October 31st, 2025
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        A Halloween Masquerade Wedding
                    </Typography>
                    <Countdown />
                </Container>
            </HeroSection>

            <Section id="about">
                <Container>
                    <AboutContent>
                        <AboutImage src="./couple.jpg" alt="Constantine and Lauren" />
                        <TextContent>
                            <GoldText variant="h2" gutterBottom>
                                Our Story
                            </GoldText>
                            <Typography paragraph>
                                On a misty Halloween night in Salem, Massachusetts, fate brought Constantine and Lauren together in the most peculiar way. Constantine, a software engineer by day and amateur ghost hunter by night, was investigating reports of mysterious code appearing in the
                                town&apos;s ancient library computers. Meanwhile, Lauren, a skilled veterinarian specializing in black cats, was tracking an unusually intelligent feline that had been reorganizing the library&apos;s occult section.
                            </Typography>
                            <Typography paragraph>
                                Their paths crossed when both reached for the same dusty tome titled &quot;Programming Spells: Where Technology Meets Magic.&quot; As their hands touched, all the computers in the library mysteriously lit up with cascading green text, and the black cat in question let
                                out what sounded suspiciously like a laugh. They spent the entire night debugging haunted computers and discussing the intersection of modern technology and ancient magic, all while sharing a pumpkin spice latte that never seemed to run empty.
                            </Typography>
                            <Typography>
                                Now, they&apos;re combining their unique talents to create the most enchanted wedding celebration ever witnessed, complete with AI-powered crystal balls and ethically sourced eye of newt. Their shared love of Halloween, technology, and the unexplained has blossomed
                                into a love story that proves sometimes the best relationships begin with a little bit of magic and a lot of debugging.
                            </Typography>
                        </TextContent>
                    </AboutContent>
                </Container>
            </Section>

            <Section id="when-where">
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        When & Where
                    </GoldText>
                    <Typography variant="h5" gutterBottom>
                        Ceremony & Reception
                    </Typography>
                    <Typography>October 31st, 2025 [Venue Details Here]</Typography>
                </Container>
            </Section>

            <Section id="hotels">
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        Accommodations
                    </GoldText>
                    <Typography variant="h5" gutterBottom>
                        Recommended Hotels
                    </Typography>
                    <Typography>[Hotel Details Here]</Typography>
                </Container>
            </Section>

            <Section id="masquerade">
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        Masquerade Details
                    </GoldText>
                    <Typography>This is a Halloween masquerade wedding celebration. Guests are encouraged to wear formal attire with masks. Dark, elegant, and mystical themes are welcome.</Typography>
                </Container>
            </Section>
        </Box>
    )
}
