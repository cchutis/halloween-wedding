# Space Invaders Audio Implementation Guide

## Audio Files Required

Place all audio files in the `/public/sounds/` directory with the following filenames:

### Music Tracks (Looping)
- `titleScreenMusic.mp3` - Plays on the title screen
- `gameLoopMusic.mp3` - Plays during gameplay
- `gameOverMusic.mp3` - Plays on the game over screen
- `highScoreMusic.mp3` - Plays on game over when player achieves a high score
- `ufoSound.mp3` - Plays only when UFO is active on screen

### Sound Effects (One-shot)
- `playerShoot.mp3` - Regular player shooting
- `playerShootBeam.mp3` - Player shooting with beam power-up
- `playerShootSpread.mp3` - Player shooting with spread power-up
- `shieldBroken.mp3` - When player shield is broken
- `playerExplode.mp3` - When player is destroyed
- `enemyShoot.mp3` - When enemies shoot
- `enemyDestroyed.mp3` - When an enemy is destroyed
- `powerUpCollected.mp3` - When player collects a power-up

## Audio Format Recommendations

- Use MP3 format for best browser compatibility
- Keep file sizes small (under 1MB per file) for faster loading
- For looping tracks, ensure they loop seamlessly without gaps
- For sound effects, keep them short and impactful

## Audio Implementation Details

The audio system uses a singleton AudioManager class that handles:
- Loading and preloading audio files
- Playing and stopping sounds
- Looping music tracks
- Muting/unmuting functionality

All audio triggers have been implemented in the game code at the appropriate locations:
- Game state changes trigger music changes
- Player actions trigger appropriate sound effects
- Enemy actions trigger appropriate sound effects
- UFO appearance/disappearance controls UFO sound

## Customizing Audio

If you want to adjust volume levels or add additional sounds:

1. Add new sound types to the `SoundType` type in `AudioManager.ts`
2. Add the file paths in the `soundPaths` object
3. If it's a looping sound, add it to the `loopingTypes` array
4. Call `audioManager.play('yourNewSound')` at the appropriate location in the game code
