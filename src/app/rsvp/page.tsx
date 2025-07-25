'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Box, Container, Typography, TextField, FormControl, FormControlLabel, Radio, RadioGroup, Button, ButtonGroup, Alert, CircularProgress } from '@mui/material'
import styled from 'styled-components'
import Navigation from '../../components/Navigation'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

// Styled components matching the home page styling
const PageWrapper = styled.div`
    min-height: 100vh;
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
`

const Section = styled.section<{ $showVideo?: boolean }>`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rem 2rem;
    position: relative;
    overflow-y: auto;
    background-image: ${(props) => (props.$showVideo ? 'none' : 'url("/moon.jpg")')};
    background-size: cover;
    background-position: center;

    @media (max-width: 768px) {
        padding: 4rem 1rem;
    }
`

const VideoBackground = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
`

const AudioToggle = styled.button`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #b8860b;
    border: 1px solid #b8860b;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(184, 134, 11, 0.2);
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

const ContentContainer = styled(Container)`
    position: relative;
    z-index: 2;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 800px;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`

const RsvpForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid rgba(184, 134, 11, 0.3);

    @media (max-width: 768px) {
        padding: 1.5rem;
        margin: 0 1rem;
    }
`

const StyledTextField = styled(TextField)`
    .MuiInputBase-root {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
    }

    .MuiOutlinedInput-root {
        & fieldset {
            border-color: #b8860b;
        }
        &:hover fieldset {
            border-color: #cd7f32;
        }
        &.Mui-focused fieldset {
            border-color: #cd7f32;
        }
    }

    .MuiInputLabel-root {
        color: rgba(255, 255, 255, 0.7);
    }

    .MuiInputBase-input {
        color: white;
    }
`

const StyledRadioGroup = styled(RadioGroup)`
    .MuiFormControlLabel-root {
        margin-left: 0;
        margin-right: 2rem;
    }

    .MuiRadio-root {
        color: #b8860b;
        &.Mui-checked {
            color: #cd7f32;
        }
    }

    .MuiFormControlLabel-label {
        color: white;
    }
`

const SubmitButton = styled(Button)`
    background-color: #b8860b;
    color: white;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #cd7f32;
    }
`

const GuestButtonGroup = styled(ButtonGroup)`
    .MuiButton-root {
        background-color: rgba(0, 0, 0, 0.5);
        border-color: #b8860b;
        color: white;
        min-width: 48px;
        padding: 0.5rem 1rem;
        transition: all 0.3s ease;

        &:hover {
            background-color: rgba(184, 134, 11, 0.2);
            border-color: #cd7f32;
        }

        &.selected {
            background-color: #b8860b;
            border-color: #cd7f32;
            color: white;

            &:hover {
                background-color: #cd7f32;
            }
        }
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

const Footer = styled.footer`
    background-color: black;
    color: white;
    text-align: center;
    padding: 2rem 0;
    width: 100%;
    margin-top: auto;
`

const QrCodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid rgba(184, 134, 11, 0.3);
    max-width: 400px;
    margin: 0 auto;
`

interface AdditionalGuest {
    name: string
}

interface GuestInfo {
    name: string
    email: string
    attending: string
    bringingGuests: string
    totalGuests: string
    additionalGuests: AdditionalGuest[]
    hasDietaryRestrictions: string
    dietaryRestrictions: string
    songRequest: string
    memory: string
}

function RsvpContent() {
    const searchParams = useSearchParams()
    const code = searchParams.get('code')

    const [isValidCode, setIsValidCode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [videoBackground, setVideoBackground] = useState<string | null>(null)
    const [isMuted, setIsMuted] = useState(true)
    const [formData, setFormData] = useState<GuestInfo>({
        name: '',
        email: '',
        attending: '',
        bringingGuests: '',
        totalGuests: '',
        additionalGuests: [],
        hasDietaryRestrictions: '',
        dietaryRestrictions: '',
        songRequest: '',
        memory: '',
    })

    // Simulate code validation
    useEffect(() => {
        const validateCode = async () => {
            // Only accept the specific code "readytomaskup"
            setIsLoading(true)

            setTimeout(() => {
                // Only the code "readytomaskup" is valid
                setIsValidCode(code === 'readytomaskup')
                setIsLoading(false)
            }, 1000)
        }

        validateCode()
    }, [code])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        // Handle special case for bringingGuests radio
        if (name === 'bringingGuests') {
            setFormData({
                ...formData,
                [name]: value,
                // Reset additional guests if user selects 'no'
                ...(value === 'no' && {
                    totalGuests: '',
                    additionalGuests: [],
                }),
            })
            return
        }

        // Handle special case for attending radio
        if (name === 'attending') {
            // Set appropriate video background based on selection
            if (value === 'no') {
                setVideoBackground('yousure.mp4')
                setIsMuted(false) // Automatically unmute when selecting "No"
            } else if (value === 'yes') {
                setVideoBackground('dance.mp4')
                setIsMuted(false) // Automatically unmute when selecting "Yes"
            } else {
                setVideoBackground(null)
                setIsMuted(true)
            }

            setFormData({
                ...formData,
                [name]: value,
                // Reset guest-related fields if user selects 'no'
                ...(value === 'no' && {
                    bringingGuests: 'no',
                    totalGuests: '',
                    additionalGuests: [],
                }),
            })
            return
        }

        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            }

            // If bringingGuests changes to 'no', reset guest data
            if (name === 'bringingGuests' && value === 'no') {
                updated.totalGuests = ''
                updated.additionalGuests = []
            }
            // If bringingGuests changes to 'yes', default to 1 guest
            else if (name === 'bringingGuests' && value === 'yes') {
                updated.totalGuests = '1'
                updated.additionalGuests = [{ name: '' }]
            }

            return updated
        })
    }

    const handleAdditionalGuestChange = (index: number, field: keyof AdditionalGuest, value: string) => {
        setFormData((prev) => {
            const updatedAdditionalGuests = [...prev.additionalGuests]
            updatedAdditionalGuests[index] = {
                ...updatedAdditionalGuests[index],
                [field]: value,
            }
            return {
                ...prev,
                additionalGuests: updatedAdditionalGuests,
            }
        })
    }

    const handleGuestNumberSelect = (additionalGuestCount: number) => {
        setFormData((prev) => {
            const currentAdditionalGuests = [...prev.additionalGuests]

            // Add new additional guest entries if needed
            while (currentAdditionalGuests.length < additionalGuestCount) {
                currentAdditionalGuests.push({ name: '' })
            }

            // Remove excess additional guest entries
            if (currentAdditionalGuests.length > additionalGuestCount) {
                currentAdditionalGuests.splice(additionalGuestCount)
            }

            return {
                ...prev,
                totalGuests: additionalGuestCount.toString(),
                additionalGuests: currentAdditionalGuests,
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate required fields
        if (!formData.name || !formData.email || !formData.attending || !formData.hasDietaryRestrictions) {
            alert('Please fill in all required fields')
            return
        }

        // Validate additional required fields based on selections
        if (formData.attending === 'yes' && !formData.bringingGuests) {
            alert('Please indicate if you are bringing guests')
            return
        }

        // Validate guest information if bringing guests
        if (formData.bringingGuests === 'yes') {
            if (!formData.totalGuests) {
                alert('Please select the number of additional guests')
                return
            }

            // Check if all guest names are filled
            const emptyGuestNames = formData.additionalGuests.some((guest) => !guest.name)
            if (emptyGuestNames) {
                alert('Please provide names for all additional guests')
                return
            }
        }

        try {
            // Set loading state
            setIsLoading(true)

            // Prepare data for submission
            const submissionData = {
                name: formData.name,
                email: formData.email,
                attending: formData.attending,
                bringingGuests: formData.bringingGuests || 'no',
                totalGuests: formData.totalGuests || '0',
                additionalGuests: formData.additionalGuests,
                dietaryRestrictions: formData.dietaryRestrictions || 'None',
                songRequest: formData.songRequest || 'None',
                memory: formData.memory || 'None',
                timestamp: new Date().toISOString(),
                code: code || 'Unknown',
            }

            console.log('Submitting RSVP data:', submissionData)

            // Add your Google Apps Script Web App URL here
            // It should look like: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
            const sheetsApiUrl = 'https://script.google.com/macros/s/AKfycbzN7YzdKWtPqs2vMKDwBXm4YWHG11EGaAhs5n2SKIFLxJQOvE1Yo12EbujCAk79EzSxCQ/exec'

            // Submit the data to Google Sheets via Apps Script
            await fetch(sheetsApiUrl, {
                method: 'POST',
                mode: 'no-cors', // Important for CORS handling
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            })

            // Show success message
            setIsLoading(false)
            setIsSubmitted(true)
        } catch (error) {
            console.error('Error submitting form:', error)
            setIsLoading(false)
            alert('There was an error submitting your RSVP. Please try again later.')
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <CircularProgress sx={{ color: '#b8860b' }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        Validating your invitation...
                    </Typography>
                </Box>
            )
        }

        if (!isValidCode) {
            return (
                <QrCodeContainer>
                    <GoldText variant="h4" align="center" gutterBottom>
                        Invalid Invitation
                    </GoldText>
                    <Typography variant="body1" paragraph sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
                        Please scan the QR code from your invitation to access the RSVP form.
                    </Typography>
                    <div style={{ backgroundColor: 'white' }}>
                        <Image src="/qr-code-example.png" alt="Sample QR Code" width={200} height={200} style={{ marginTop: '1rem' }} />
                    </div>
                    <Typography variant="body2" sx={{ color: '#b8860b', mt: 2, textAlign: 'center' }}>
                        If you&apos;re having trouble, please contact us for assistance.
                    </Typography>
                </QrCodeContainer>
            )
        }

        if (isSubmitted) {
            const isAttending = formData.attending === 'yes'
            return (
                <Box sx={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <Alert
                        severity="success"
                        sx={{
                            backgroundColor: 'rgba(46, 125, 50, 0.2)',
                            color: '#81c784',
                            mb: 3,
                        }}
                    >
                        Thank you for your response!
                    </Alert>
                    <GoldText variant="h4" gutterBottom>
                        Your RSVP has been received
                    </GoldText>

                    {isAttending ? (
                        <>
                            <Typography variant="body1" paragraph sx={{ color: 'white', mb: 3 }}>
                                We&apos;re so excited you&apos;ll be joining us for our Halloween masquerade wedding!
                            </Typography>

                            <Box
                                sx={{
                                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                    border: '1px solid rgba(184, 134, 11, 0.3)',
                                    borderRadius: '8px',
                                    padding: '2rem',
                                    mb: 3,
                                    textAlign: 'left',
                                }}
                            >
                                <GoldText variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                                    🎭 Masquerade Dress Code Reminder 🎭
                                </GoldText>

                                <Typography variant="body1" paragraph sx={{ color: 'white', mb: 2 }}>
                                    <strong>Dress Code:</strong> Wedding attire required! Masquerade masks are strongly preferred.
                                </Typography>

                                <Typography variant="body1" paragraph sx={{ color: 'white', mb: 2 }}>
                                    Let your personality shine! Masquerade looks are not limited to masks, they can include headpieces and dramatic makeup. Let your creativity flow!
                                </Typography>

                                <Button onClick={() => (window.location.href = '/#hero')}>
                                    <Typography variant="body2" sx={{ color: '#b8860b', textAlign: 'center', mt: 2 }}>
                                        Click here for more inspiration and details about the masquerade theme!
                                    </Typography>
                                </Button>
                            </Box>

                            <Typography variant="body1" paragraph sx={{ color: 'white', mb: 3 }}>
                                We can&apos;t wait to see your amazing masquerade look and celebrate this magical night with you!
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body1" paragraph sx={{ color: 'white', mb: 3 }}>
                            We&apos;re sorry you can&apos;t make it, but we understand and appreciate you letting us know.
                        </Typography>
                    )}

                    <Image src="/logo.png" alt="Wedding Logo" width={100} height={100} style={{ marginTop: '1rem' }} />
                </Box>
            )
        }

        return (
            <>
                <GoldText variant="h3" align="center" gutterBottom>
                    RSVP
                </GoldText>
                <Typography variant="body1" paragraph sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
                    Don&apos;t ghost us! 👻 We kindly request your response by <strong style={{ color: 'maroon', fontSize: '1.3rem' }}>September 30th, 2025</strong>.
                </Typography>

                <RsvpForm onSubmit={handleSubmit}>
                    <StyledTextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required fullWidth variant="outlined" />

                    <StyledTextField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth variant="outlined" />

                    <FormControl component="fieldset" required>
                        <Typography variant="body2" sx={{ color: '#b8860b', mb: 1 }}>
                            Will you be attending? *
                        </Typography>
                        <StyledRadioGroup name="attending" value={formData.attending} onChange={handleChange} row>
                            <FormControlLabel value="yes" control={<Radio />} label="🥀 Hex yeah, I'll be there!" />
                            <FormControlLabel value="no" control={<Radio />} label="🪦 RIP... Can't make it" />
                        </StyledRadioGroup>
                    </FormControl>

                    {formData.attending === 'yes' && (
                        <>
                            <FormControl component="fieldset" required>
                                <Typography variant="body2" sx={{ color: '#b8860b', mb: 1 }}>
                                    Are you bringing a guest? *
                                </Typography>
                                <StyledRadioGroup name="bringingGuests" value={formData.bringingGuests} onChange={handleChange} row>
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                </StyledRadioGroup>
                            </FormControl>

                            {formData.bringingGuests === 'yes' && (
                                <FormControl component="fieldset" required>
                                    <Typography variant="body2" sx={{ color: '#b8860b', mb: 2 }}>
                                        Number of Additional Guests
                                    </Typography>
                                    <GuestButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {[1, 2].map((num) => (
                                            <Button key={num} className={formData.totalGuests === num.toString() ? 'selected' : ''} onClick={() => handleGuestNumberSelect(num)}>
                                                {num}
                                            </Button>
                                        ))}
                                    </GuestButtonGroup>
                                </FormControl>
                            )}

                            {/* Additional Guests Details */}
                            {formData.bringingGuests === 'yes' &&
                                formData.additionalGuests.map((guest, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            border: '1px solid rgba(184, 134, 11, 0.3)',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: '#b8860b', mb: 1 }}>
                                            Additional Guest {index + 1}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <StyledTextField label={`Guest ${index + 1} Name`} value={guest.name} onChange={(e) => handleAdditionalGuestChange(index, 'name', e.target.value)} required fullWidth variant="outlined" size="small" />
                                        </Box>
                                    </Box>
                                ))}
                            <FormControl component="fieldset" required>
                                <Typography variant="body2" sx={{ color: '#b8860b', mb: 1 }}>
                                    Do you have any dietary restrictions or food allergies? *
                                </Typography>
                                <StyledRadioGroup name="hasDietaryRestrictions" value={formData.hasDietaryRestrictions} onChange={handleChange} row>
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                </StyledRadioGroup>
                            </FormControl>
                            {formData.hasDietaryRestrictions === 'yes' && (
                                <StyledTextField
                                    label="Dietary Restrictions or Food Allergies (for your whole party)"
                                    name="dietaryRestrictions"
                                    value={formData.dietaryRestrictions}
                                    onChange={handleChange}
                                    multiline
                                    rows={2}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Please list any dietary restrictions or food allergies for anyone in your party"
                                    required
                                />
                            )}

                            <Box>
                                <Typography variant="body2" sx={{ color: '#b8860b', mb: 1 }}>
                                    Song Request
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, fontSize: '0.875rem' }}>
                                    Suggest a song you&apos;d love to hear at the reception! We can&apos;t promise to play every request, but we&apos;ll do our best to include your favorites.
                                </Typography>
                                <StyledTextField name="songRequest" value={formData.songRequest} onChange={handleChange} placeholder="What song will get you on the dance floor?" fullWidth variant="outlined" />
                            </Box>

                            {/* <Box>
                                <Typography variant="body2" sx={{ color: '#b8860b', mb: 1 }}>
                                    Share a Memory
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, fontSize: '0.875rem' }}>
                                    We&apos;d love to hear a favorite memory you have with us! Whether it&apos;s a funny story, a special moment, or just something that makes you smile when you think of us.
                                </Typography>
                                <StyledTextField name="memory" value={formData.memory} onChange={handleChange} placeholder="Share a special memory or message..." multiline rows={3} fullWidth variant="outlined" />
                            </Box> */}
                        </>
                    )}

                    <SubmitButton type="submit" variant="contained" fullWidth>
                        Submit RSVP
                    </SubmitButton>
                </RsvpForm>
            </>
        )
    }

    return (
        <PageWrapper>
            <Navigation />
            <Section $showVideo={!!videoBackground}>
                {videoBackground === 'yousure.mp4' && (
                    <VideoBackground autoPlay loop playsInline muted={isMuted} key="yousure-video">
                        <source src="/yousure.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </VideoBackground>
                )}
                {videoBackground === 'dance.mp4' && (
                    <VideoBackground autoPlay loop playsInline muted={isMuted} key="dance-video">
                        <source src="/dance.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </VideoBackground>
                )}
                {videoBackground && <AudioToggle onClick={() => setIsMuted(!isMuted)}>{isMuted ? '🔇 Unmute' : '🔊 Mute'}</AudioToggle>}
                <ImageOverlay />
                <ContentContainer>{renderContent()}</ContentContainer>
            </Section>
            <Footer>
                <Container>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        &copy; 2024 Constantine & Lauren. All rights reserved.
                    </Typography>
                </Container>
            </Footer>
        </PageWrapper>
    )
}

export default function RsvpPage() {
    return (
        <Suspense
            fallback={
                <PageWrapper>
                    <Navigation />
                    <Section>
                        <ImageOverlay />
                        <ContentContainer>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                                <CircularProgress sx={{ color: '#b8860b' }} />
                            </Box>
                        </ContentContainer>
                    </Section>
                    <Footer>
                        <Container>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                &copy; 2024 Constantine & Lauren. All rights reserved.
                            </Typography>
                        </Container>
                    </Footer>
                </PageWrapper>
            }
        >
            <RsvpContent />
        </Suspense>
    )
}
