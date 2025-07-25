// Audio Manager for Space Invaders Game
// This utility manages all game sounds and music
// Handles browser autoplay restrictions by requiring user interaction before playing sounds

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
        this.initSounds()
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager()
        }
        return AudioManager.instance
    }

    private initSounds(): void {
        // Initialize all sounds
        Object.entries(this.soundPaths).forEach(([type, path]) => {
            const audio = new Audio()
            audio.src = path
            audio.preload = 'auto'

            // Set looping for music tracks
            if (this.loopingTypes.includes(type as SoundType)) {
                audio.loop = true
            }

            this.sounds.set(type as SoundType, audio)
        })
    }

    public play(type: SoundType): void {
        if (this.isMuted) return

        const sound = this.sounds.get(type)
        if (!sound) return

        // If user hasn't interacted yet, queue the sound for later
        if (!this.userInteracted) {
            this.pendingSounds.set(type, this.loopingTypes.includes(type))
            return
        }

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
                const AudioContextClass = window.AudioContext || 
                    ((window as unknown) as {webkitAudioContext: typeof AudioContext}).webkitAudioContext
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
    }

    public stop(type: SoundType): void {
        const sound = this.sounds.get(type)
        if (!sound) return

        sound.pause()
        sound.currentTime = 0

        if (this.loopingSounds.has(type)) {
            this.loopingSounds.delete(type)
        }

        if (this.currentMusic === type) {
            this.currentMusic = null
        }
    }

    public stopAllMusic(): void {
        this.loopingTypes.forEach((type) => {
            this.stop(type)
        })
    }

    public stopAll(): void {
        this.sounds.forEach((sound) => {
            sound.pause()
            sound.currentTime = 0
        })
        this.loopingSounds.clear()
        this.currentMusic = null
    }

    public mute(): void {
        this.isMuted = true
        this.sounds.forEach((sound) => {
            sound.muted = true
        })
    }

    public unmute(): void {
        this.isMuted = false
        this.sounds.forEach((sound) => {
            sound.muted = false
        })
    }

    public toggleMute(): void {
        if (this.isMuted) {
            this.unmute()
        } else {
            this.mute()
        }
    }

    public isSoundLoaded(type: SoundType): boolean {
        const sound = this.sounds.get(type)
        return !!sound && sound.readyState >= 2
    }

    public areAllSoundsLoaded(): boolean {
        return Array.from(this.sounds.values()).every((sound) => sound.readyState >= 2)
    }
    
    /**
     * Call this method when the user interacts with the page (click, keypress, etc.)
     * This will enable audio playback and play any pending sounds
     */
    public handleUserInteraction(): void {
        if (this.userInteracted) return
        
        this.userInteracted = true
        
        // Play any pending sounds
        this.pendingSounds.forEach((isLooping, type) => {
            this.play(type)
        })
        
        this.pendingSounds.clear()
    }
}

export default AudioManager.getInstance()
