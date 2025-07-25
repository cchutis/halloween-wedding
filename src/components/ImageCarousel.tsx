'use client'

import React from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Styled components for the carousel
const CarouselContainer = styled.div`
    width: 100%;
    margin-top: 2rem;
    overflow: hidden;

    .slick-slide {
        padding: 0 8px;
    }

    .slick-track {
        display: flex !important;
    }
`

const ImageContainer = styled.div`
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    height: 200px;

    @media (max-width: 600px) {
        height: 160px;
    }

    @media (max-width: 960px) {
        height: 140px;
        width: 140px;
    }
`

const CarouselImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`

interface ImageCarouselProps {
    images: {
        src: string
        alt: string
    }[]
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    // Settings for the slider
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: false,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    }

    return (
        <CarouselContainer>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <ImageContainer>
                            <CarouselImage src={image.src} alt={image.alt} />
                        </ImageContainer>
                    </div>
                ))}
            </Slider>
        </CarouselContainer>
    )
}

export default ImageCarousel
