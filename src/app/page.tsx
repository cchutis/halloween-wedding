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
                    <GoldText variant="h2" gutterBottom>
                        Our Story
                    </GoldText>
                    <Typography>Join us for an enchanted evening as we celebrate our love with a mystical Halloween wedding celebration.</Typography>
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
