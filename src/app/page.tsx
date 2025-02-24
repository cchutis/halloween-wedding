'use client'

import React from 'react'
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
    padding-bottom: 1rem;
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

const Footer = styled.footer`
    background-color: black;
    color: white;
    text-align: center;
    padding: 1rem 0;
    position: relative;
    bottom: 0;
    width: 100%;
`

const ContactSection = styled(Box)`
    padding: 4rem 0;
    background-color: black;
    color: #b8860b;
`

const ContactForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
    margin: 2rem auto;
`

const StyledInput = styled.input`
    padding: 1rem;
    border: 1px solid #333;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 1rem;
    &:focus {
        outline: none;
        border-color: #4a4a4a;
    }
`

const StyledTextArea = styled.textarea`
    padding: 1rem;
    border: 1px solid #333;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 1rem;
    min-height: 150px;
    resize: vertical;
    &:focus {
        outline: none;
        border-color: #4a4a4a;
    }
`

const SubmitButton = styled.button`
    padding: 1rem 2rem;
    background-color: #4a4a4a;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #666;
    }
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

            <Section id="about" style={{ backgroundColor: '#1C1C1C' }}>
                <Container>
                    <AboutContent>
                        <AboutImage src="./couple.jpg" alt="Constantine and Lauren" />
                        <TextContent>
                            <GoldText variant="h2" gutterBottom>
                                Our Story
                            </GoldText>
                            <Typography paragraph>We’re so excited to celebrate our wedding with all of you on October 31, 2025—a night of love, laughter, and a little bit of mystery.</Typography>
                            <Typography paragraph>
                                Set in a historic mansion on Halloween, our wedding will embrace the enchantment of the season with a masquerade theme, blending elegance with just the right touch of the unexpected. We can’t wait to see everyone donning their finest attire (and masks!) as we dance
                                the night away in a setting straight out of a storybook.
                            </Typography>
                            <Typography paragraph>Here, you’ll find all the details you need to join us for this unforgettable night—accommodations, schedules, dress code, and more. Thank you for being part of our journey; we can’t wait to celebrate with you!</Typography>
                        </TextContent>
                    </AboutContent>
                </Container>
            </Section>

            <Section id="when-where" style={{ backgroundColor: 'black' }}>
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        When & Where
                    </GoldText>
                    <Typography paragraph>Join us for a Halloween night wedding unlike any other on October 31, 2025, at the breathtaking Westbury Manor in Westbury, NY.</Typography>
                    <Typography paragraph>
                        This historic Victorian estate, nestled on Long Island’s Gold Coast, is known for its grand architecture, lush gardens, and timeless elegance—the perfect backdrop for a night of mystery, romance, and celebration. With its warm, inviting interiors and stunning outdoor spaces,
                        Westbury Manor sets the stage for an unforgettable evening.{' '}
                        <a href="https://www.westburymanor.com/" target="_blank" rel="noopener">
                            Learn more about the venue here
                        </a>
                        .
                    </Typography>
                    <Typography paragraph>
                        Our celebration begins at 6:30 PM, with a candlelit outdoor ceremony at 7 PM (weather permitting). Afterward, enjoy a cocktail hour that flows between the gardens and manor, blending indoor and outdoor enchantment before heading inside for an elegant reception in the grand
                        ballroom. The night will be filled with dinner, dancing, and all the magic you’d expect from a masquerade wedding on All Hallows’ Eve.
                    </Typography>
                </Container>
            </Section>

            <Section id="wedding-party" style={{ backgroundColor: '#1C1C1C' }}>
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        Wedding Party
                    </GoldText>
                    <Typography paragraph>We can&apos;t wait to introduce you to the incredible friends and family standing by our side on our big day! Each of them has played a special role in our journey, and we&apos;re so grateful to have them celebrating with us.</Typography>
                    <Typography paragraph>Check back soon for a sneak peek at our wedding party, complete with photos, fun bios, and maybe even a little insider scoop on how we met each of them.</Typography>
                </Container>
            </Section>

            <Section id="hotels" style={{ backgroundColor: '#23272E' }}>
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        Accommodations
                    </GoldText>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        For your convenience, we&apos;ve compiled a list of nearby hotels to ensure a comfortable stay during our Halloween night wedding at Westbury Manor. While we haven&apos;t reserved room blocks, these accommodations are in close proximity to our venue:
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                        {/* Hotel Cards */}
                        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}></Box>
                                <Box>
                                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Hilton Garden Inn Westbury
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Located approximately 0.7 miles from Westbury Manor, this hotel offers modern amenities including an indoor pool, fitness center, and on-site dining. It&apos;s within walking distance to various shops and restaurants.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'none', border: '2px solid #D4AF37', padding: '8px 16px', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px' }}>HILTON</button>
                            </Box>
                        </Box>

                        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}></Box>
                                <Box>
                                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Courtyard by Marriott Westbury Long Island
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Situated about 0.8 miles from the venue, this hotel provides contemporary rooms, an indoor pool, and a fitness center. Guests can enjoy easy access to nearby attractions and dining options.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'none', border: '2px solid #D4AF37', padding: '8px 16px', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px' }}>MARRIOTT</button>
                            </Box>
                        </Box>

                        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}></Box>
                                <Box>
                                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Viana Hotel and Spa Westbury
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Approximately 1.5 miles from Westbury Manor, this boutique hotel features luxury accommodations, a full-service spa, and the Marco Polo restaurant, blending East and West cuisines.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'none', border: '2px solid #D4AF37', padding: '8px 16px', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px' }}>VIANA HOTEL AND SPA</button>
                            </Box>
                        </Box>

                        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}></Box>
                                <Box>
                                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Homewood Suites by Hilton Carle Place - Garden City, NY
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Located around 1.7 miles from the venue, this all-suite hotel offers extended-stay accommodations with in-room kitchens, complimentary breakfast, and an indoor pool.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'none', border: '2px solid #D4AF37', padding: '8px 16px', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px' }}>HILTON</button>
                            </Box>
                        </Box>

                        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}></Box>
                                <Box>
                                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        The Roslyn, Tapestry Collection by Hilton
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Situated approximately 4.6 miles from Westbury Manor, this hotel provides elegant rooms, an on-site restaurant, and easy access to local attractions.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'none', border: '2px solid #D4AF37', padding: '8px 16px', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px' }}>HILTON</button>
                            </Box>
                        </Box>

                        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box sx={{ width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0, borderRadius: 1 }}></Box>
                                <Box>
                                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#D4AF37' }}>
                                        Hilton Garden Inn Roslyn
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        About 5.2 miles from the venue, this hotel offers comfortable accommodations, an indoor pool, and on-site dining facilities.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'none', border: '2px solid #D4AF37', padding: '8px 16px', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px' }}>HILTON</button>
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 4 }}>
                        We recommend booking your accommodations early, as our wedding date coincides with Halloween festivities, and local hotels may experience higher demand. For additional options and real-time availability, consider visiting Hotels.com or Expedia. If you have any questions or
                        need further assistance with accommodations, please don&apos;t hesitate to contact us.
                    </Typography>
                </Container>
            </Section>

            <Section id="masquerade" style={{ backgroundColor: '#1C1C1C' }}>
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        Masquerade Details
                    </GoldText>

                    {/* Introduction */}
                    <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                        A <strong>masquerade wedding on Halloween night</strong>—what could be more magical? We&apos;re embracing the elegance and mystery of <strong>Venetian-style masquerade balls</strong>, where masks add an air of intrigue, sophistication, and celebration. Whether you choose
                        something classic, ornate, or a little spooky, your mask will be a stunning part of the night&apos;s atmosphere.
                    </Typography>

                    {/* History Section */}
                    <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                        A Brief History of Masquerades
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                        Masquerade balls date back to the <strong>15th and 16th centuries</strong> in Italy, particularly in <strong>Venice</strong>, where they were a highlight of the famous <strong>Carnival of Venice</strong>. These grand celebrations allowed guests to wear elaborate masks,
                        blurring social lines and encouraging a night of revelry, dance, and elegance. Over time, masquerades became symbols of <strong>romance, mystery, and opulence</strong>, eventually spreading across Europe and influencing celebrations worldwide.
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                        On <strong>Halloween night</strong>, masks take on an even more enchanting role—blending the theatrical beauty of the masquerade with the playful and mysterious spirit of the season.
                    </Typography>

                    {/* Mask Ideas Section */}
                    <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                        Mask Ideas & Inspiration
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Your mask is an opportunity to <strong>express your personal style</strong> while embracing the theme. Here are a few ideas to get you started:
                    </Typography>
                    <Box component="ul" sx={{ mb: 4, pl: 4 }}>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <strong>Classic Venetian Masks</strong> – Inspired by traditional Italian masquerades, these feature intricate designs, feathers, and metallic accents.
                        </Typography>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <strong>Filigree Metal Masks</strong> – Elegant and lightweight, these lace-like metal masks add a regal touch.
                        </Typography>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <strong>Feathered & Plumed Masks</strong> – Dramatic and bold, perfect for those who love a flair for the extravagant.
                        </Typography>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <strong>Phantom of the Opera Half Masks</strong> – A minimal yet mysterious option for a sleek, refined look.
                        </Typography>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <strong>Gothic or Dark Fantasy Masks</strong> – Think skulls, ravens, or baroque-inspired dark designs—a perfect fit for a Halloween masquerade.
                        </Typography>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <strong>Minimalist Masquerade Masks</strong> – Simple eye masks in classic black, gold, or silver can be effortlessly stylish.
                        </Typography>
                    </Box>

                    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                        To elevate your ensemble, consider coordinating your mask with your attire. Matching the colors, materials, or motifs of your mask to your suit or dress can create a cohesive and striking look. Feel free to get creative—<strong>designing your own mask</strong> or customizing
                        an existing one can add a personal touch to your outfit.
                    </Typography>

                    <Box sx={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', p: 3, borderRadius: 2, mb: 4 }}>
                        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                            <strong>Tip:</strong> If you&apos;re going for comfort, choose a mask that secures with ribbons or elastic rather than a stick-held design. Some masks even come on glasses frames for maximum comfort all night long!
                        </Typography>
                    </Box>

                    {/* Where to Find Section */}
                    <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                        Where to Find a Mask
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Not sure where to look? Here are some great places to find high-quality masquerade masks:
                    </Typography>
                    <Box component="ul" sx={{ mb: 4, pl: 4 }}>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <a href="https://www.etsy.com/search?q=masquerade+mask" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                Etsy
                            </a>{' '}
                            – Handmade, customizable, and unique.
                        </Typography>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <a href="https://www.masqueradestore.com/" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                Masquerade Store
                            </a>{' '}
                            – A variety of Venetian, lace, and themed masks.
                        </Typography>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <a href="https://www.amazon.com/s?k=masquerade+mask" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                Amazon
                            </a>{' '}
                            – Quick and easy options with fast shipping.
                        </Typography>
                        <Typography component="li" sx={{ mb: 1 }}>
                            <a href="https://www.spirithalloween.com/" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                Costume Shops
                            </a>{' '}
                            – Spirit Halloween and local costume shops often have masks this time of year.
                        </Typography>
                    </Box>

                    {/* Contest Section */}
                    <Box sx={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', p: 3, borderRadius: 2, mb: 4 }}>
                        <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                            Best Mask Contest
                        </Typography>
                        <Typography variant="body1">
                            To add to the fun, we&apos;ll be hosting a <strong>&quot;Best Mask&quot; contest</strong> during the reception! Show off your creativity and craftsmanship for a chance to win a special prize. Whether you purchase a mask or craft one yourself, we&apos;re excited to see the
                            unique designs our guests bring to the celebration.
                        </Typography>
                    </Box>

                    {/* Photo Inspiration Section */}
                    <Typography variant="h4" component="h3" sx={{ color: '#D4AF37', mb: 2 }}>
                        Photo Inspiration
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Need some visual inspiration? Check out these stunning masquerade looks:
                    </Typography>
                    <Box component="ul" sx={{ mb: 4, pl: 4 }}>
                        {[
                            { text: 'Labyrinth Masquerade Ball Outfit Ideas', url: 'https://www.purecostumes.com/blog/labyrinth-masquerade-ball-outfit-ideas/' },
                            { text: 'Masquerade Ball Outfit Ideas', url: 'https://www.pinterest.com/cshempert84/masquerade-ball-outfit-ideas/' },
                            { text: 'Masquerade Mask Inspiration Gallery', url: 'https://masqueboutique.com/masquerade-masks-image-gallery/' },
                            { text: 'Masquerade Ball Inspiration: 10 Unique Mask Ideas', url: 'https://www.lizbreygel.com/2023/11/masquerade-ball-inspiration-10-unique-mask-ideas-for-every-taste.html' },
                            { text: 'Masquerade Party Dress Collection', url: 'https://www.amazon.com/Masquerade-Party-Dress/s?k=Masquerade+Party+Dress' },
                            { text: 'Masquerade Mask Inspiration Board', url: 'https://www.pinterest.com/lisasheets7/masquerade-masks/' },
                            { text: 'Masquerade Ball Outfit Ideas', url: 'https://www.pinterest.com/nikkisam80/masquerade-outfit/' },
                            { text: 'Masquerade Ball Costume Ideas', url: 'https://www.reddit.com/r/Halloween_Costumes/comments/16tthhj/masquerade_ball_costume_ideas/' },
                            { text: 'Masquerade Party Ideas', url: 'https://www.greenvelope.com/blog/masquerade-party' },
                            { text: 'Masquerade Outfit Ideas: Party in Style', url: 'https://www.sherrihill.com/blogs/news/masquerade-outfit-ideas-party-in-style' },
                        ].map((link, index) => (
                            <Typography component="li" key={index} sx={{ mb: 1 }}>
                                <a href={link.url} style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                    {link.text}
                                </a>
                            </Typography>
                        ))}
                    </Box>

                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                        We can&apos;t wait to see everyone in their masquerade best—whether it&apos;s dramatic and bold or sleek and mysterious. The only rule? <strong>Have fun with it!</strong>
                    </Typography>
                </Container>
            </Section>

            <Section id="honeyfund" style={{ backgroundColor: '#1A1A1A' }}>
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        Honeyfund – The Best Gift is You!
                    </GoldText>

                    <Typography
                        variant="body1"
                        paragraph
                        sx={{
                            textAlign: 'center',
                            fontSize: '1.1rem',
                            mb: 3,
                            color: '#FFF',
                        }}
                    >
                        Your presence at our wedding is the greatest gift we could ask for. However, if you&apos;d like to contribute to our honeymoon fund or a special experience, we&apos;ve set up a Honeyfund to make it easy. Instead of a traditional gift registry, we&apos;re inviting guests to
                        help us create unforgettable memories—whether it&apos;s a romantic dinner, an adventurous excursion, or a relaxing spa day.
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 4,
                            mb: 4,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#D4AF37',
                                textAlign: 'center',
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            💛 Want to gift us an experience?
                        </Typography>
                        <a
                            href="INSERT_HONEYFUND_LINK_HERE"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                textDecoration: 'none',
                                color: '#B8860B',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                padding: '12px 24px',
                                border: '2px solid #B8860B',
                                borderRadius: '4px',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                    backgroundColor: '#B8860B',
                                    color: '#1A1A1A',
                                },
                            }}
                        >
                            Visit our Honeyfund
                        </a>
                    </Box>

                    {/* Honeyfund Widget - Uncomment and replace with actual widget code when available */}
                    {/* <Box sx={{ width: '100%', mt: 4 }}>
                        <iframe 
                            src="HONEYFUND_WIDGET_URL"
                            width="100%"
                            height="600px"
                            frameBorder="0"
                            scrolling="no"
                        />
                    </Box> */}
                </Container>
            </Section>

            <Section id="song-requests" style={{ backgroundColor: '#1C1C1C' }}>
                <Container>
                    <GoldText variant="h2" gutterBottom>
                        Song Requests
                    </GoldText>
                    <Typography paragraph>
                        Help us build the ultimate wedding playlist! If there&apos;s a song that will get you on the dance floor, let us know—we want to make sure there&apos;s something for everyone. Whether it&apos;s a classic, a guilty pleasure, or a Halloween-themed banger, we&apos;re taking
                        requests!
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <iframe src="https://open.spotify.com/embed/playlist/7kgTGs1bijkEt0RsOpoYr0" width="100%" height="380" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{ maxWidth: '700px' }}></iframe>
                        <Box sx={{ textAlign: 'center', maxWidth: '600px' }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#b8860b' }}>
                                How to Add Songs:
                            </Typography>
                            <Typography paragraph>
                                1. Follow our collaborative playlist on Spotify
                                <br />
                                2. Search for your favorite songs
                                <br />
                                3. Add them directly to the playlist
                            </Typography>
                            <a
                                href="https://open.spotify.com/playlist/7kgTGs1bijkEt0RsOpoYr0?si=TkWJdWZITCi5lASoxExnbA"
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
                </Container>
            </Section>

            <ContactSection id="contact">
                <Container maxWidth="lg">
                    <Typography variant="h2" component="h2" align="center" sx={{ mb: 4, color: '#B8860B' }}>
                        Ask Us a Question:
                    </Typography>
                    <ContactForm
                        onSubmit={(e) => {
                            e.preventDefault()
                            // Handle form submission here
                            const formData = new FormData(e.currentTarget)
                            const data = {
                                name: formData.get('name'),
                                email: formData.get('email'),
                                message: formData.get('message'),
                            }
                            console.log('Form data:', data)
                            // Clear form
                            e.currentTarget.reset()
                            alert('Thank you for your message! We will get back to you soon.')
                        }}
                    >
                        <StyledInput type="text" name="name" placeholder="Your Name" required />
                        <StyledInput type="email" name="email" placeholder="Your Email" required />
                        <StyledTextArea name="message" placeholder="Your Message" required />
                        <SubmitButton type="submit">Send Message</SubmitButton>
                    </ContactForm>
                </Container>
            </ContactSection>

            <Footer>
                <Typography variant="body2">2025 Constantine and Lauren&apos;s Wedding. All rights reserved.</Typography>
            </Footer>
        </Box>
    )
}
