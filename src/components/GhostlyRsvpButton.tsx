import React from 'react';
import { Box } from '@mui/material';

const GhostlyRsvpButton: React.FC = () => {
  return (
    <Box
      sx={{
        mt: 4,
        display: 'inline-block',
        position: 'relative',
        '&:hover': {
          '& .ghost-duplicate': {
            opacity: 0.6,
          },
          '& .ghost-duplicate-1': {
            transform: 'translate(-8px, -5px)',
            filter: 'blur(1.5px) brightness(1.5)',
          },
          '& .ghost-duplicate-2': {
            transform: 'translate(8px, 3px)',
            filter: 'blur(2px) brightness(1.2)',
          },
          '& .main-button': {
            animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite',
          },
        },
        '@keyframes shake': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0)',
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translate(-1px, 0) rotate(-0.5deg)',
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translate(1px, 1px) rotate(0.5deg)',
          },
        },
      }}
    >
      {/* Ghost duplicate 1 */}
      <Box
        className="ghost-duplicate ghost-duplicate-1"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          transition: 'all 0.4s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#7a5c0c',
            padding: '16px 32px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            border: '2px solid #7a5c0c',
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '200px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                backgroundImage: 'url("/mask-icon.svg")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'brightness(0) invert(40%) sepia(40%) saturate(400%) hue-rotate(20deg) brightness(80%) contrast(80%)',
              }}
            />
            RSVP Now
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                backgroundImage: 'url("/mask-icon.svg")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'brightness(0) invert(40%) sepia(40%) saturate(400%) hue-rotate(20deg) brightness(80%) contrast(80%)',
              }}
            />
          </Box>
        </Box>
      </Box>
      
      {/* Ghost duplicate 2 */}
      <Box
        className="ghost-duplicate ghost-duplicate-2"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          transition: 'all 0.4s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#7a5c0c',
            padding: '16px 32px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            border: '2px solid #7a5c0c',
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '200px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                backgroundImage: 'url("/mask-icon.svg")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'brightness(0) invert(40%) sepia(40%) saturate(400%) hue-rotate(20deg) brightness(80%) contrast(80%)',
              }}
            />
            RSVP Now
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                backgroundImage: 'url("/mask-icon.svg")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'brightness(0) invert(40%) sepia(40%) saturate(400%) hue-rotate(20deg) brightness(80%) contrast(80%)',
              }}
            />
          </Box>
        </Box>
      </Box>
      
      {/* Main button with link */}
      <Box
        className="main-button"
        component="a"
        href="/rsvp"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'inline-block',
          textDecoration: 'none',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#b8860b',
            padding: '16px 32px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            border: '2px solid #b8860b',
            borderRadius: '8px',
            transition: 'all 0.4s ease',
            textAlign: 'center',
            minWidth: '200px',
            zIndex: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.2) 0%, rgba(0, 0, 0, 0) 50%, rgba(184, 134, 11, 0.2) 100%)',
              zIndex: -1,
            },
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(184, 134, 11, 0.3)',
              color: '#cd7f32',
              borderColor: '#cd7f32',
              '&:after': {
                opacity: 1,
                transform: 'scale(1.1)',
              }
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                backgroundImage: 'url("/mask-icon.svg")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'brightness(0) invert(50%) sepia(50%) saturate(500%) hue-rotate(20deg) brightness(90%) contrast(90%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'brightness(0) invert(60%) sepia(70%) saturate(500%) hue-rotate(10deg) brightness(100%) contrast(90%)',
                }
              }}
            />
            RSVP Now
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                backgroundImage: 'url("/mask-icon.svg")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'brightness(0) invert(50%) sepia(50%) saturate(500%) hue-rotate(20deg) brightness(90%) contrast(90%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'brightness(0) invert(60%) sepia(70%) saturate(500%) hue-rotate(10deg) brightness(100%) contrast(90%)',
                }
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '2px solid rgba(184, 134, 11, 0.3)',
            borderRadius: '8px',
            transform: 'translate(4px, 4px)',
            zIndex: 1,
            pointerEvents: 'none',
            transition: 'all 0.4s ease',
            opacity: 0.8,
          }}
        />
      </Box>
    </Box>
  );
};

export default GhostlyRsvpButton;
