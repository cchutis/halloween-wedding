'use client'

import React, { useState, useEffect } from 'react'
import { Box, Container, Typography, TextField, FormControl, FormControlLabel, Radio, RadioGroup, Button, Alert, CircularProgress } from '@mui/material'
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

const Section = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rem 2rem;
    position: relative;
    overflow-y: auto;
    background-image: url('/moon.jpg');
    background-size: cover;
    background-position: center;

    @media (max-width: 768px) {
        padding: 4rem 1rem;
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

interface GuestInfo {
    name: string
    email: string
    attending: string
    guests: string
    dietaryRestrictions: string
    songRequest: string
}

export default function RsvpPage() {
    const searchParams = useSearchParams()
    const code = searchParams.get('code')

    const [isValidCode, setIsValidCode] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [formData, setFormData] = useState<GuestInfo>({
        name: '',
        email: '',
        attending: '',
        guests: '',
        dietaryRestrictions: '',
        songRequest: '',
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // In a real app, you would submit this data to your backend
        console.log('Form submitted:', formData)

        // Show success message
        setIsSubmitted(true)
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
                    <Image src="/qr-sample.png" alt="Sample QR Code" width={200} height={200} style={{ marginTop: '1rem' }} />
                    <Typography variant="body2" sx={{ color: '#b8860b', mt: 2, textAlign: 'center' }}>
                        If you&apos;re having trouble, please contact us for assistance.
                    </Typography>
                </QrCodeContainer>
            )
        }

        if (isSubmitted) {
            return (
                <Box sx={{ textAlign: 'center' }}>
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
                    <Typography variant="body1" paragraph sx={{ color: 'white', mb: 3 }}>
                        We&apos;re looking forward to celebrating with you on our special day.
                    </Typography>
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
                    Please let us know if you&apos;ll be joining us for our Halloween wedding celebration. We kindly request your response by September 15, 2025.
                </Typography>

                <RsvpForm onSubmit={handleSubmit}>
                    <StyledTextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required fullWidth variant="outlined" />

                    <StyledTextField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth variant="outlined" />

                    <FormControl component="fieldset" required>
                        <Typography variant="body2" sx={{ color: '#b8860b', mb: 1 }}>
                            Will you be attending?
                        </Typography>
                        <StyledRadioGroup name="attending" value={formData.attending} onChange={handleChange} row>
                            <FormControlLabel value="yes" control={<Radio />} label="Yes, I'll be there!" />
                            <FormControlLabel value="no" control={<Radio />} label="Sorry, I can't make it" />
                        </StyledRadioGroup>
                    </FormControl>

                    {formData.attending === 'yes' && (
                        <>
                            <StyledTextField label="Number of Guests (including yourself)" name="guests" type="number" InputProps={{ inputProps: { min: 1, max: 10 } }} value={formData.guests} onChange={handleChange} required fullWidth variant="outlined" />

                            <StyledTextField label="Dietary Restrictions or Allergies" name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleChange} multiline rows={2} fullWidth variant="outlined" />

                            <StyledTextField label="Song Request" name="songRequest" value={formData.songRequest} onChange={handleChange} placeholder="What song will get you on the dance floor?" fullWidth variant="outlined" />
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
            <Section>
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
