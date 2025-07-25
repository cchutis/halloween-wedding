// Audio Manager for Space Invaders Game
// This utility manages all game sounds and music
// Handles browser autoplay restrictions by requiring user interaction before playing sounds
// Uses client-side only initialization to be compatible with SSR

// Sound Types
export type SoundType =
    // Music
    | 'titleScreenMusic'
    | 'gameLoopMusic'
    | 'gameOverMusic'
    | 'highScoreMusic'
    | 'ufoSound'
    // SFX
    | 'playerShoot'
    | 'playerShootBeam'
    | 'playerShootSpread'
    | 'shieldBroken'
    | 'playerExplode'
    | 'enemyShoot'
    | 'enemyDestroyed'
    | 'powerUpCollected'

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined'

// Singleton Audio Manager
class AudioManager {
    private static instance: AudioManager
    private sounds: Map<SoundType, HTMLAudioElement> = new Map()
    private loopingSounds: Set<SoundType> = new Set()
    private currentMusic: SoundType | null = null
    private isMuted: boolean = false
    private userInteracted: boolean = false
    private pendingSounds: Map<SoundType, boolean> = new Map() // Tracks sounds that should play once user interacts

    // Sound file paths - update these when you have the actual files
    private soundPaths: Record<SoundType, string> = {
        // Music tracks
        titleScreenMusic: '/sounds/titleScreenMusic.ogg',
        gameLoopMusic: '/sounds/gameLoopMusic.wave',
        gameOverMusic: '/sounds/gameOverMusic.ogg',
        highScoreMusic: '/sounds/highScoreMusic.ogg',
        ufoSound: '/sounds/ufoSound.wav',

        // Sound effects
        playerShoot: '/sounds/playerShoot.wav',
        playerShootBeam: '/sounds/playerShootBeam.wav',
        playerShootSpread: '/sounds/playerShootSpread.wav',
        shieldBroken: '/sounds/shieldBroken.wav',
        playerExplode: '/sounds/playerExplode.wav',
        enemyShoot: '/sounds/enemyShoot.wav',
        enemyDestroyed: '/sounds/enemyDestroyed.wav',
        powerUpCollected: '/sounds/powerUpCollected.wav',
    }

        // Looping sounds
    private loopingTypes: SoundType[] = ['titleScreenMusic', 'gameLoopMusic', 'gameOverMusic', 'highScoreMusic', 'ufoSound']

    private constructor() {
        // Only initialize sounds if in browser environment
        if (isBrowser) {
            this.initSounds()
        }
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager()
        }
        return AudioManager.instance
    }

    private initSounds(): void {
        // Skip initialization if not in browser
        if (!isBrowser) return
        
        try {
            // Initialize all sounds
            Object.entries(this.soundPaths).forEach(([type, path]) => {
                // Create audio element safely
                const audio = new Audio()
                audio.src = path
                audio.preload = 'auto'

                // Set looping for music tracks
                if (this.loopingTypes.includes(type as SoundType)) {
                    audio.loop = true
                }

                this.sounds.set(type as SoundType, audio)
            })
        } catch (error) {
            console.error('Failed to initialize sounds:', error)
        }
    }

    public play(type: SoundType): void {
        // Skip if not in browser or audio is muted
        if (!isBrowser || this.isMuted) return

        const sound = this.sounds.get(type)
        if (!sound) return

        // If user hasn't interacted yet, queue the sound for later
        if (!this.userInteracted) {
            this.pendingSounds.set(type, this.loopingTypes.includes(type))
            return
        }

        try {
            // Handle music tracks (stop current music before playing new one)
            if (this.loopingTypes.includes(type)) {
                this.stopAllMusic()
                sound.currentTime = 0
                sound.play().catch(error => {
                    console.warn(`Failed to play ${type}:`, error)
                    // Queue for later if it fails
                    this.pendingSounds.set(type, true)
                })
                this.currentMusic = type
                this.loopingSounds.add(type)
            } else {
                // For sound effects, use AudioContext for more responsive playback
                try {
                    // Create a new audio context for immediate playback
                    // Using proper type definition for AudioContext
                    const AudioContextClass = window.AudioContext
                    const audioContext = new AudioContextClass()
                    
                    // Use existing audio element but with optimized playback
                    const soundClone = sound.cloneNode(true) as HTMLAudioElement
                    
                    // Optimize for immediate playback
                    soundClone.volume = 1.0
                    soundClone.playbackRate = 1.0
                    soundClone.preload = 'auto'
                    
                    // Reduce latency by setting currentTime to a small value
                    // This can help with some browsers that have initial playback delay
                    soundClone.currentTime = 0.01
                    
                    // Start playback immediately
                    soundClone.play().catch(error => {
                        console.warn(`Failed to play ${type}:`, error)
                    })
                    
                    // Clean up when done
                    soundClone.onended = () => {
                        if (audioContext.state !== 'closed') {
                            audioContext.close().catch(console.error)
                        }
                    }
                } catch {
                    // Fallback to standard audio playback with optimizations
                    const soundClone = sound.cloneNode(true) as HTMLAudioElement
                    soundClone.volume = 1.0
                    soundClone.playbackRate = 1.0
                    soundClone.preload = 'auto'
                    soundClone.currentTime = 0.01
                    
                    // Use setTimeout with 0ms to push to next event loop cycle
                    // This can help reduce audio delay in some browsers
                    setTimeout(() => {
                        soundClone.play().catch(error => {
                            console.warn(`Failed to play ${type}:`, error)
                        })
                    }, 0)
                }
            }
        } catch (error) {
            console.error(`Error playing sound ${type}:`, error)
        }
    }

    public stop(type: SoundType): void {
        // Skip if not in browser
        if (!isBrowser) return

        const sound = this.sounds.get(type)
        if (!sound) return

        try {
            sound.pause()
            sound.currentTime = 0

            if (this.loopingSounds.has(type)) {
                this.loopingSounds.delete(type)
            }

            if (this.currentMusic === type) {
                this.currentMusic = null
            }
        } catch (error) {
            console.error(`Error stopping sound ${type}:`, error)
        }
    }

    public stopAllMusic(): void {
        // Skip if not in browser
        if (!isBrowser) return

        this.loopingTypes.forEach((type) => {
            this.stop(type)
        })
    }

    public stopAll(): void {
        // Skip if not in browser
        if (!isBrowser) return

        try {
            this.sounds.forEach((sound) => {
                sound.pause()
                sound.currentTime = 0
            })
            this.loopingSounds.clear()
            this.currentMusic = null
        } catch (error) {
            console.error('Error stopping all sounds:', error)
        }
    }

    public mute(): void {
        this.isMuted = true
        
        // Skip audio operations if not in browser
        if (!isBrowser) return

        try {
            this.sounds.forEach((sound) => {
                sound.muted = true
            })
        } catch (error) {
            console.error('Error muting sounds:', error)
        }
    }

    public unmute(): void {
        this.isMuted = false
        
        // Skip audio operations if not in browser
        if (!isBrowser) return

        try {
            this.sounds.forEach((sound) => {
                sound.muted = false
            })
        } catch (error) {
            console.error('Error unmuting sounds:', error)
        }
    }

    public toggleMute(): void {
        if (this.isMuted) {
            this.unmute()
        } else {
            this.mute()
        }
    }

    public isSoundLoaded(type: SoundType): boolean {
        // Not loaded if not in browser
        if (!isBrowser) return false

        const sound = this.sounds.get(type)
        return !!sound && sound.readyState >= 2
    }

    public areAllSoundsLoaded(): boolean {
        // Not loaded if not in browser
        if (!isBrowser) return false
        if (this.sounds.size === 0) return false

        try {
            return Array.from(this.sounds.values()).every((sound) => sound.readyState >= 2)
        } catch {
            return false
        }
    }
    
    /**
     * Call this method when the user interacts with the page (click, keypress, etc.)
     * This will enable audio playback and play any pending sounds
     */
    public handleUserInteraction(): void {
        // Skip if not in browser or already interacted
        if (!isBrowser || this.userInteracted) return
        
        this.userInteracted = true
        
        try {
            // Play any pending sounds
            this.pendingSounds.forEach((isLooping, type) => {
                this.play(type)
            })
            
            this.pendingSounds.clear()
        } catch (error) {
            console.error('Error handling user interaction:', error)
        }
    }
}

export default AudioManager.getInstance()
