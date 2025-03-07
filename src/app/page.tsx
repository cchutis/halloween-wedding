'use client'

import React from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import styled from 'styled-components'
import Navigation from '../components/Navigation'
import Countdown from '../components/Countdown'
import Image from 'next/image'

const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 8rem 0;
    scroll-snap-align: start;
    position: relative;
    overflow-y: auto;

    @media (max-width: 768px) {
        padding: 4rem 0;
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
    padding: 4rem 0;
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
    padding: 0;

    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.4;
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
    z-index: 3;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    color: white;
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

    @media (max-width: 768px) {
        padding: 1rem;
    }
`

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

                <ImageSection id="about" style={{ backgroundImage: `url('/candle.jpg')`, backgroundPosition: 'top' }}>
                    <ImageOverlay />
                    <ImageContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, maxWidth: '1200px', margin: '0 auto', flexDirection: { xs: 'column', md: 'row' } }}>
                            <Box
                                sx={{
                                    flex: { xs: '1 1 auto', md: '0 0 400px' },
                                    width: { xs: '100%', md: 'auto' },
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    padding: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <img src="./couple.jpg" alt="Constantine and Lauren" style={{ width: '100%', height: 'auto', borderRadius: 2 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <GoldText variant="h2" gutterBottom>
                                    Our Story
                                </GoldText>
                                <Typography paragraph sx={{ color: 'white' }}>
                                    We&apos;re so excited to celebrate our wedding with all of you on October 31, 2025—a night of love, laughter, and a little bit of mystery.
                                </Typography>
                                <Typography paragraph sx={{ color: 'white' }}>
                                    Set in a historic mansion on Halloween, our wedding will embrace the enchantment of the season with a masquerade theme, blending elegance with just the right touch of the unexpected. We can&apos;t wait to see everyone donning their finest attire (and masks!) as we
                                    dance the night away in a setting straight out of a storybook.
                                </Typography>
                                <Typography paragraph sx={{ color: 'white' }}>
                                    Here, you&apos;ll find all the details you need to join us for this unforgettable night—accommodations, schedules, dress code, and more. Thank you for being part of our journey; we can&apos;t wait to celebrate with you!
                                </Typography>
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
                            Join us for a Halloween night wedding unlike any other on October 31, 2025, at the breathtaking Westbury Manor in Westbury, NY.
                        </Typography>
                        <Typography paragraph sx={{ color: 'white' }}>
                            This historic Victorian estate, nestled on Long Island&apos;s Gold Coast, is known for its grand architecture, lush gardens, and timeless elegance—the perfect backdrop for a night of mystery, romance, and celebration. With its warm, inviting interiors and stunning outdoor
                            spaces, Westbury Manor sets the stage for an unforgettable evening.{' '}
                            <a href="https://www.westburymanor.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                Learn more about the venue here
                            </a>
                            .
                        </Typography>
                        <Typography paragraph sx={{ color: 'white' }}>
                            Our celebration begins at 6:30 PM, with a outdoor ceremony at 7 PM (weather permitting). Afterward, enjoy a cocktail hour that flows between the gardens and manor, blending indoor and outdoor enchantment before heading inside for an elegant reception in the grand
                            ballroom. The night will be filled with dinner, dancing, and all the magic you&apos;d expect from a masquerade wedding on All Hallows&apos; Eve.
                        </Typography>
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

                <ImageSection id="masquerade" style={{ backgroundImage: `url('/masks.jpg')` }}>
                    <ImageOverlay />
                    <ImageContent>
                        <GoldText variant="h2" gutterBottom>
                            Masquerade Details
                        </GoldText>

                        {/* Introduction */}
                        <Typography variant="body1" paragraph sx={{ mb: 4, color: 'white' }}>
                            A <strong>masquerade wedding on Halloween night</strong>—what could be more magical? We’re embracing the elegance and mystery of <strong>Venetian-style masquerade balls</strong>, where masks add an air of intrigue, sophistication, and celebration. Whether you choose
                            something classic, ornate, or a little spooky, your mask will be a stunning part of the night’s atmosphere.
                        </Typography>

                        {/* History Section */}
                        <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                            A Brief History of Masquerades
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 4, color: 'white' }}>
                            Masquerade balls began in the <strong>15th-century Venice</strong>, where elaborate masks allowed guests to revel in anonymity and grandeur. Over time, they became symbols of <strong>romance, mystery, and opulence</strong>, spreading across Europe and influencing
                            celebrations worldwide.
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 4, color: 'white' }}>
                            On <strong>Halloween night</strong>, masks blend theatrical beauty with the playful, mysterious spirit of the season.
                        </Typography>

                        {/* Mask Ideas Section */}
                        <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                            Mask Ideas & Inspiration
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                            Your mask is an opportunity to <strong>express your personal style</strong> while embracing the theme. Here are a few ideas:
                        </Typography>

                        <Box component="ul" sx={{ mb: 4, pl: 4, color: 'white' }}>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <strong>Classic Venetian Masks</strong> – Intricate, timeless, and adorned with metallic accents.
                                <a href="https://www.etsy.com/search?q=venetian+masquerade+mask" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    {' '}
                                    [View Examples]{' '}
                                </a>
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <strong>Filigree Metal Masks</strong> – Delicate, lace-like designs with a regal touch.
                                <a href="https://www.masqueradestore.com/collections/women-lace-masks" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    {' '}
                                    [View Examples]{' '}
                                </a>
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <strong>Feathered & Plumed Masks</strong> – Bold and dramatic for a statement look.
                                <a href="https://www.simplymasquerade.co.uk/masqueradeshop/cat_50367-Feather-Masks.html" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    {' '}
                                    [View Examples]{' '}
                                </a>
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <strong>Dark Gothic Masks</strong> – Skulls, ravens, or baroque-inspired designs for a hauntingly beautiful effect.
                                <a href="https://www.etsy.com/search?q=gothic+masquerade+mask" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    {' '}
                                    [View Examples]{' '}
                                </a>
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <strong>Minimalist Eye Masks</strong> – Sleek black, gold, or silver for effortless elegance.
                                <a href="https://www.masqueradestore.com/simple-eye-masks" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    {' '}
                                    [View Examples]{' '}
                                </a>
                            </Typography>
                        </Box>

                        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2, mb: 4 }}>
                            <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'white' }}>
                                <strong>Tip:</strong> For comfort, opt for a mask that secures with ribbons or elastic rather than a stick-held design. Some even come on glasses frames for all-night wearability!
                            </Typography>
                        </Box>

                        {/* Where to Find Section */}
                        <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                            Where to Find a High-Quality Mask
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                            Skip the Mardi Gras styles—here’s where to find elegant, high-quality masks:
                        </Typography>
                        <Box component="ul" sx={{ mb: 4, pl: 4, color: 'white' }}>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <a href="https://www.etsy.com/search?q=masquerade+mask" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    Etsy
                                </a>{' '}
                                – Handmade, customizable, and unique.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <a href="https://www.venetianmasksociety.com/" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    The Venetian Mask Society
                                </a>{' '}
                                – Authentic Venetian masks crafted in Italy.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <a href="https://www.simplymasquerade.co.uk/" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    Simply Masquerade
                                </a>{' '}
                                – Luxury filigree and hand-painted designs.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                <a href="https://www.amazon.com/s?k=masquerade+mask" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    Amazon
                                </a>{' '}
                                – A mix of quality and convenience with fast shipping.
                            </Typography>
                        </Box>

                        {/* Contest Section */}
                        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, borderRadius: 2, mb: 4 }}>
                            <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                                Best Mask Contest
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                To add to the fun, we’ll be hosting a <strong>&quot;Best Mask&quot; contest</strong> during the reception! Show off your creativity and craftsmanship for a chance to win a special prize. Whether you purchase a mask or craft one yourself, we’re excited to see the
                                unique designs our guests bring to the celebration.
                            </Typography>
                        </Box>

                        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', textAlign: 'center', color: 'white' }}>
                            We can’t wait to see everyone in their masquerade best—whether it’s dramatic and bold or sleek and mysterious. The only rule? <strong>Have fun with it!</strong>
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
                                <iframe src="https://open.spotify.com/embed/playlist/7kgTGs1bijkEt0RsOpoYr0" width="100%" height="380" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
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
                                    href="https://open.spotify.com/playlist/7kgTGs1bijkEt0RsOpoYr0?si=adb8a8c428cf469b&pt=8832f8a853e68cf32008db7d44f845b7"
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
                        <GoldText variant="h2" gutterBottom align="center">
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
