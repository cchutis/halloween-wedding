import React, { useEffect, useRef, useState, useCallback } from 'react'

interface GameObject {
    x: number
    y: number
    width: number
    height: number
    speed: number
}

interface PowerUp extends GameObject {
    active: boolean
    type: 'beam' | 'spread' | 'shield'
}

interface Player extends GameObject {
    lives: number
    score: number
    powered: boolean
    powerType?: 'beam' | 'spread' | 'shield'
    powerTimer: number
    shielded: boolean
    dying: boolean
    deathTimer: number
}

interface Enemy extends GameObject {
    type: 'ghost' | 'pumpkin' | 'bat'
    row: number
    col: number
    active: boolean
}

interface UFO extends GameObject {
    active: boolean
    direction: number
    points: number
    powerType: 'beam' | 'spread' | 'shield'
}

interface Bullet extends GameObject {
    active: boolean
    isEnemy: boolean
    isBeam?: boolean
    isSpread?: boolean
}

interface Barricade extends GameObject {
    health: number
    speed: number
    damagePoints: { x: number; y: number; radius: number }[]
}

interface Explosion extends GameObject {
    active: boolean
    duration: number
    startTime: number
    speed: number
}

type GameState = 'title' | 'playing' | 'paused' | 'gameOver' | 'levelComplete'

// Game Configuration - Easy to adjust
const CONFIG = {
    // UFO Settings
    UFO_SPAWN_INTERVAL: 7000, // 7 seconds between spawns
    UFO_SPAWN_CHANCE: 0.7, // 70% spawn chance
    UFO_SPEED: 2, // Reduced from 4 to 2
    UFO_MIN_POINTS: 100,
    UFO_MAX_POINTS: 300,

    // Enemy Movement
    INITIAL_MOVE_INTERVAL: 800, // Faster initial speed for smoother movement
    MIN_MOVE_INTERVAL: 300, // Not as fast at maximum
    MOVE_STEP: 15, // Reduced horizontal movement for smoother motion
    VERTICAL_STEP: 30, // How far down they move each bounce
    VERTICAL_SPEED_MULTIPLIER: 1.2, // Less aggressive speed increase
    ENEMY_COUNT_MULTIPLIER: 1.3, // Less aggressive count multiplier
    BARRICADE_SPEED_MULTIPLIER: 1.5, // Speed boost after hitting barricades

    // Player Settings
    PLAYER_FIRE_RATE: 500,
    PLAYER_SPEED: 5,
    BULLET_SPEED: 10, // Increased bullet speed

    // Game Dimensions
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,

    // Game Over Settings
    GAME_OVER_HEIGHT: 580, // Almost at the bottom of the canvas
}

const GAME_WIDTH = CONFIG.GAME_WIDTH
const GAME_HEIGHT = CONFIG.GAME_HEIGHT
const PLAYER_WIDTH = 50
const PLAYER_HEIGHT = 50
const ENEMY_WIDTH = 40
const ENEMY_HEIGHT = 40
const BULLET_WIDTH = 8 // Increased from 5 to 8 for better hit detection
const BULLET_HEIGHT = 15
const BARRICADE_WIDTH = 60
const BARRICADE_HEIGHT = 40
const INITIAL_BARRICADE_HEALTH = 100
const DAMAGE_RADIUS = 3
const UFO_HEIGHT = 30
const UFO_WIDTH = 40

interface GameProps {
    onGameOver?: (score: number) => void
}

const Game: React.FC<GameProps> = ({ onGameOver }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number | null>(null)
    const startButtonRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)
    const restartButtonRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)
    const gameLoopStarted = useRef(false)
    const initialized = useRef(false)

    // Initialize state
    const [gameState, setGameState] = useState<GameState>('title')
    const [powerUp, setPowerUp] = useState<PowerUp | null>(null)
    const [player, setPlayer] = useState<Player>({
        x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        speed: 5,
        lives: 3,
        score: 0,
        powered: false,
        powerType: undefined,
        powerTimer: 0,
        shielded: false,
        dying: false,
        deathTimer: 0,
    })

    const [enemies, setEnemies] = useState<Enemy[]>(() => {
        const enemies: Enemy[] = []
        const types: ('ghost' | 'pumpkin' | 'bat')[] = ['ghost', 'pumpkin', 'bat']

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                enemies.push({
                    x: col * (ENEMY_WIDTH + 20) + 50,
                    y: row * (ENEMY_HEIGHT + 20) + 50,
                    width: ENEMY_WIDTH,
                    height: ENEMY_HEIGHT,
                    speed: 1,
                    type: types[row],
                    row,
                    col,
                    active: true,
                })
            }
        }
        return enemies
    })

    const [bullets, setBullets] = useState<Bullet[]>([])
    const [barricades, setBarricades] = useState<Barricade[]>(() => {
        const barricades: Barricade[] = []
        for (let i = 0; i < 4; i++) {
            barricades.push({
                x: (GAME_WIDTH / 5) * (i + 1) - BARRICADE_WIDTH / 2,
                y: GAME_HEIGHT - PLAYER_HEIGHT - 80,
                width: BARRICADE_WIDTH,
                height: BARRICADE_HEIGHT,
                speed: 0,
                health: INITIAL_BARRICADE_HEALTH,
                damagePoints: [],
            })
        }
        return barricades
    })

    const [ufo, setUfo] = useState<UFO | null>(null)
    const [explosions, setExplosions] = useState<Explosion[]>([])
    const lastUfoSpawn = useRef(Date.now())

    const keysRef = useRef<{ [key: string]: boolean }>({})

    const moveDirection = useRef(1)
    const lastMoveTime = useRef(Date.now())
    const moveInterval = useRef(CONFIG.INITIAL_MOVE_INTERVAL)
    const lastEnemyShot = useRef(Date.now())
    const enemyShootInterval = useRef(2000)
    const lastPlayerShot = useRef(Date.now())
    const level = useRef(1)

    // For star animation
    const [starPositions] = useState(() => {
        const positions = []
        for (let i = 0; i < 50; i++) {
            positions.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.7 + 0.3,
            })
        }
        return positions
    })
    const lastStarUpdate = useRef(Date.now())

    const checkCollision = useCallback((obj1: GameObject, obj2: GameObject) => {
        // Add small buffer to bullet hitbox for more forgiving collisions
        const buffer = obj1.width === BULLET_WIDTH ? 4 : 0

        const bounds1 = {
            left: Math.round(obj1.x) - buffer,
            right: Math.round(obj1.x + obj1.width) + buffer,
            top: Math.round(obj1.y),
            bottom: Math.round(obj1.y + obj1.height),
        }

        const bounds2 = {
            left: Math.round(obj2.x),
            right: Math.round(obj2.x + obj2.width),
            top: Math.round(obj2.y),
            bottom: Math.round(obj2.y + obj2.height),
        }

        return bounds1.left < bounds2.right && bounds1.right > bounds2.left && bounds1.top < bounds2.bottom && bounds1.bottom > bounds2.top
    }, [])

    const shoot = useCallback(
        (isEnemy: boolean = false, x: number = player.x, y: number = player.y) => {
            const currentTime = Date.now()

            if (!isEnemy && currentTime - lastPlayerShot.current < CONFIG.PLAYER_FIRE_RATE) {
                return
            }

            if (!isEnemy) {
                lastPlayerShot.current = currentTime
            }

            // Handle power-up shots
            if (!isEnemy && player.powered) {
                if (player.powerType === 'beam') {
                    setBullets((prev) => [
                        ...prev,
                        {
                            x: x + PLAYER_WIDTH / 2 - 20,
                            y: player.y, // Start at player position
                            width: 40,
                            height: 50, // Start with smaller height
                            speed: 15, // Slower speed for better visibility
                            active: true,
                            isEnemy: false,
                            isBeam: true,
                        },
                    ])
                } else if (player.powerType === 'spread') {
                    setBullets((prev) => [
                        ...prev,
                        {
                            x: x + PLAYER_WIDTH / 2 - 15,
                            y: player.y,
                            width: 30,
                            height: 20,
                            speed: CONFIG.BULLET_SPEED,
                            active: true,
                            isEnemy: false,
                            isSpread: true,
                            isBeam: false,
                        },
                    ])
                }
                setPlayer((p) => ({ ...p, powered: false, powerType: undefined }))
                return
            }

            setBullets((prev) => [
                ...prev,
                {
                    x: x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
                    y: y,
                    width: BULLET_WIDTH,
                    height: BULLET_HEIGHT,
                    speed: isEnemy ? 3 : CONFIG.BULLET_SPEED,
                    active: true,
                    isEnemy,
                    isBeam: false,
                    isSpread: false,
                },
            ])
        },
        [player.x, player.y, player.powered, player.powerType]
    )

    const initializeLevel = useCallback((levelNumber: number) => {
        const enemies: Enemy[] = []
        const types: ('ghost' | 'pumpkin' | 'bat')[] = ['ghost', 'pumpkin', 'bat']
        const baseSpeed = 2 + levelNumber * 0.5
        const rows = Math.min(3 + Math.floor(levelNumber / 2), 5)

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < 8; col++) {
                enemies.push({
                    x: col * (ENEMY_WIDTH + 20) + 50,
                    y: row * (ENEMY_HEIGHT + 20) + 50,
                    width: ENEMY_WIDTH,
                    height: ENEMY_HEIGHT,
                    speed: baseSpeed,
                    type: types[row % 3],
                    row,
                    col,
                    active: true,
                })
            }
        }

        // Reset game state but keep barricades
        setEnemies(enemies)
        setBullets([])
        setUfo(null)
        setPowerUp(null)
        setPlayer((p) => ({ ...p, powered: false }))
        moveInterval.current = CONFIG.INITIAL_MOVE_INTERVAL
        lastUfoSpawn.current = Date.now()

        // Initialize new barricades
        const newBarricades: Barricade[] = []
        const barricadeCount = 4
        const spacing = (GAME_WIDTH - barricadeCount * BARRICADE_WIDTH) / (barricadeCount + 1)

        for (let i = 0; i < barricadeCount; i++) {
            newBarricades.push({
                x: spacing + i * (BARRICADE_WIDTH + spacing),
                y: GAME_HEIGHT - PLAYER_HEIGHT - 100,
                width: BARRICADE_WIDTH,
                height: BARRICADE_HEIGHT,
                speed: 0,
                health: INITIAL_BARRICADE_HEALTH,
                damagePoints: [],
            })
        }
        setBarricades(newBarricades)
    }, [])

    const checkGameState = useCallback(() => {
        if (enemies.length === 0 && gameState === 'playing') {
            setGameState('levelComplete')
            setTimeout(() => {
                level.current++
                initializeLevel(level.current)
                setGameState('playing') // Add this line to ensure game continues
            }, 2000)
        }
    }, [enemies.length, gameState, initializeLevel])

    const updateGameState = useCallback(() => {
        if (gameState !== 'playing') return

        const currentTime = Date.now()

        // Handle UFO spawning and movement
        if (!ufo) {
            if (currentTime - lastUfoSpawn.current >= CONFIG.UFO_SPAWN_INTERVAL) {
                lastUfoSpawn.current = currentTime
                if (Math.random() < CONFIG.UFO_SPAWN_CHANCE) {
                    // Randomly choose direction and power type
                    const direction = Math.random() < 0.5 ? 1 : -1
                    const startX = direction === 1 ? GAME_WIDTH : -UFO_WIDTH
                    const powerTypes: ('beam' | 'spread' | 'shield')[] = ['beam', 'spread', 'shield']
                    const powerType = powerTypes[Math.floor(Math.random() * powerTypes.length)]

                    setUfo({
                        x: startX,
                        y: 20,
                        width: UFO_WIDTH,
                        height: UFO_HEIGHT,
                        speed: CONFIG.UFO_SPEED,
                        active: true,
                        direction,
                        points: CONFIG.UFO_MIN_POINTS + Math.floor(Math.random() * ((CONFIG.UFO_MAX_POINTS - CONFIG.UFO_MIN_POINTS) / 50)) * 50,
                        powerType,
                    })
                }
            }
        } else {
            // Move UFO
            setUfo((prev) => {
                if (!prev) return null
                const newX = prev.x - prev.speed * prev.direction
                // Remove UFO if it goes off screen and reset power-up state
                if ((prev.direction === 1 && newX < -UFO_WIDTH) || (prev.direction === -1 && newX > GAME_WIDTH)) {
                    setPowerUp(null)
                    return null
                }
                return { ...prev, x: newX }
            })
        }

        // Move power-up if it exists
        if (powerUp?.active) {
            setPowerUp((prev) => {
                if (!prev) return null
                const newY = prev.y + 2

                // Check for collision with enemies
                for (const enemy of enemies) {
                    if (checkCollision({ ...prev, y: newY }, enemy)) {
                        // Trigger explosion
                        handleExplosion(prev.x, prev.y)
                        // Remove the enemy
                        setEnemies((current) => current.filter((e) => e !== enemy))
                        // Stop the power-up
                        return { ...prev, active: false }
                    }
                }

                // Check for collision with player
                if (checkCollision({ ...prev, y: newY }, player)) {
                    if (prev.type === 'shield') {
                        // For shield powerup, set shielded to true but don't set powered
                        setPlayer((p) => ({
                            ...p,
                            shielded: true,
                            powerType: prev.type,
                            powerTimer: 300,
                        }))
                    } else {
                        // For other powerups, set powered to true
                        setPlayer((p) => ({
                            ...p,
                            powered: true,
                            powerType: prev.type,
                            powerTimer: 300,
                        }))
                    }
                    return { ...prev, active: false }
                }

                return { ...prev, y: newY }
            })
        }

        // Update player position
        let newX = player.x
        if (keysRef.current['ArrowLeft']) newX -= player.speed
        if (keysRef.current['ArrowRight']) newX += player.speed
        newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newX))

        setPlayer((prev) => ({
            ...prev,
            x: newX,
        }))

        // Handle enemy shooting
        if (currentTime - lastEnemyShot.current >= enemyShootInterval.current) {
            lastEnemyShot.current = currentTime
            // Randomly select a bottom-row enemy to shoot
            const bottomEnemies = enemies.reduce((acc, enemy) => {
                const isBottomEnemy = !enemies.some((other) => other.col === enemy.col && other.row > enemy.row)
                if (isBottomEnemy) acc.push(enemy)
                return acc
            }, [] as Enemy[])

            if (bottomEnemies.length > 0) {
                const shooter = bottomEnemies[Math.floor(Math.random() * bottomEnemies.length)]
                shoot(true, shooter.x, shooter.y + ENEMY_HEIGHT)
            }
        }

        // Update bullets and check collisions
        setBullets((prev) => {
            const updatedBullets = prev.map((bullet) => {
                if (!bullet.active) return bullet

                if (bullet.isBeam) {
                    // Beam logic
                    const newHeight = bullet.height + bullet.speed
                    const newY = Math.max(0, bullet.y - bullet.speed)

                    // Check for enemy collisions in the beam's column
                    const bulletCenterX = bullet.x + bullet.width / 2
                    setEnemies((currentEnemies) => {
                        const survivingEnemies = currentEnemies.filter((enemy) => {
                            const enemyCenterX = enemy.x + enemy.width / 2
                            const hitByBeam = Math.abs(enemyCenterX - bulletCenterX) < enemy.width && enemy.y > newY && enemy.y < bullet.y + newHeight
                            if (hitByBeam) {
                                setPlayer((p) => ({ ...p, score: p.score + 100 * level.current }))
                            }
                            return !hitByBeam
                        })
                        return survivingEnemies
                    })

                    // Remove beam when it reaches full height
                    if (newY <= 0 && newHeight >= GAME_HEIGHT) {
                        return { ...bullet, active: false }
                    }

                    return {
                        ...bullet,
                        y: newY,
                        height: newHeight,
                    }
                } else if (bullet.isSpread) {
                    const newY = bullet.y - bullet.speed

                    // Check for direct collision first
                    let didHitEnemy = false
                    setEnemies((currentEnemies) => {
                        // Find the directly hit enemy
                        const hitEnemyIndex = currentEnemies.findIndex((enemy) => {
                            if (!enemy.active) return false
                            return checkCollision({ ...bullet, y: newY }, enemy)
                        })

                        if (hitEnemyIndex !== -1) {
                            didHitEnemy = true
                            const hitEnemy = currentEnemies[hitEnemyIndex]

                            // Create explosion effect
                            setExplosions((prev) => [
                                ...prev,
                                {
                                    x: hitEnemy.x,
                                    y: hitEnemy.y,
                                    width: hitEnemy.width * 3, // Wider explosion
                                    height: hitEnemy.height,
                                    active: true,
                                    duration: 500,
                                    startTime: Date.now(),
                                    speed: 0,
                                },
                            ])

                            // Mark enemies for destruction (hit enemy and its neighbors)
                            return currentEnemies
                                .map((enemy, index) => {
                                    if (!enemy.active) return enemy
                                    if (index === hitEnemyIndex || index === hitEnemyIndex - 1 || index === hitEnemyIndex + 1) {
                                        setPlayer((p) => ({ ...p, score: p.score + 100 * level.current }))
                                        return { ...enemy, active: false }
                                    }
                                    return enemy
                                })
                                .filter((e) => e.active)
                        }
                        return currentEnemies
                    })

                    if (didHitEnemy || newY <= 0) {
                        return { ...bullet, active: false }
                    }

                    return {
                        ...bullet,
                        y: newY,
                    }
                }

                // Normal bullet behavior
                const newY = bullet.y + (bullet.isEnemy ? bullet.speed : -bullet.speed)
                let shouldKeepBullet = true

                // Check UFO collision first
                if (
                    !bullet.isEnemy &&
                    ufo &&
                    ufo.active &&
                    checkCollision(
                        {
                            ...bullet,
                            y: newY,
                        },
                        ufo
                    )
                ) {
                    shouldKeepBullet = false
                    // Always drop power-up when UFO is hit
                    if (ufo) {
                        // If there's already a powerup, replace it
                        setPowerUp({
                            x: ufo.x + ufo.width / 2,
                            y: ufo.y + ufo.height,
                            width: 15,
                            height: 15,
                            speed: 2,
                            active: true,
                            type: ufo.powerType,
                        })
                    }
                    setUfo(null)
                    setPlayer((p) => ({ ...p, score: p.score + ufo.points }))
                }

                // Check enemy bullet collision with player shield
                if (bullet.isEnemy && player.shielded && checkCollision({ ...bullet, y: newY }, player)) {
                    setPlayer((p) => ({ ...p, shielded: false }))
                    shouldKeepBullet = false
                }

                // Check collision with barricades
                if (shouldKeepBullet) {
                    for (const barricade of barricades) {
                        if (
                            checkCollision(
                                {
                                    ...bullet,
                                    y: newY,
                                },
                                barricade
                            )
                        ) {
                            handleBarricadeCollision(bullet, barricade)
                            shouldKeepBullet = false
                            break
                        }
                    }
                }

                // Check other collisions based on bullet type
                if (shouldKeepBullet) {
                    if (bullet.isEnemy) {
                        // Enemy bullets can hit player
                        if (
                            checkCollision(
                                {
                                    ...bullet,
                                    y: newY,
                                },
                                player
                            )
                        ) {
                            shouldKeepBullet = false
                            // If player has a shield, remove it instead of game over
                            if (player.shielded) {
                                setPlayer((p) => ({
                                    ...p,
                                    shielded: false,
                                    score: Math.max(0, p.score - 25), // Less penalty when shield absorbs hit
                                }))
                            } else {
                                // No shield, trigger death animation
                                setPlayer((p) => ({
                                    ...p,
                                    lives: 0,
                                    score: Math.max(0, p.score - 50),
                                    dying: true,
                                    deathTimer: 60, // Animation frames
                                }))

                                // Create explosion at player position
                                handleExplosion(player.x + player.width / 2, player.y + player.height / 2)

                                // Delay game over to show death animation
                                setTimeout(() => {
                                    setGameState('gameOver')
                                    onGameOver?.(player.score)
                                }, 1500) // 1.5 seconds delay
                            }
                        }
                    } else {
                        // Player bullets can hit enemies
                        for (const enemy of enemies) {
                            if (
                                checkCollision(
                                    {
                                        ...bullet,
                                        y: newY,
                                    },
                                    enemy
                                )
                            ) {
                                shouldKeepBullet = false
                                setEnemies((current) => current.filter((e) => e !== enemy))
                                setPlayer((p) => ({ ...p, score: p.score + 100 * level.current }))
                                break
                            }
                        }
                    }
                }

                return {
                    ...bullet,
                    y: newY,
                    active: shouldKeepBullet && newY > 0 && newY < GAME_HEIGHT,
                }
            })

            return updatedBullets.filter((bullet) => bullet.active)
        })

        // Update enemies with grid-like movement
        if (currentTime - lastMoveTime.current >= moveInterval.current) {
            lastMoveTime.current = currentTime

            // Check for barricade collisions first
            const enemyHitBarricade = enemies.some((enemy) => barricades.some((barricade) => enemy.y + enemy.height >= barricade.y && enemy.x < barricade.x + barricade.width && enemy.x + enemy.width > barricade.x))

            if (enemyHitBarricade) {
                setBarricades([]) // Remove all barricades
                // Speed up enemies significantly after hitting barricades
                moveInterval.current = Math.max(CONFIG.MIN_MOVE_INTERVAL, moveInterval.current / CONFIG.BARRICADE_SPEED_MULTIPLIER)
            }

            setEnemies((prev) => {
                const newEnemies = [...prev]
                let shouldMoveDown = false
                let direction = moveDirection.current

                // Check if any enemy would hit the walls
                for (const enemy of newEnemies) {
                    const nextX = enemy.x + direction * CONFIG.MOVE_STEP
                    if (nextX <= 0 || nextX + enemy.width >= GAME_WIDTH) {
                        shouldMoveDown = true
                        direction *= -1
                        break
                    }
                }

                // Update enemy positions
                for (const enemy of newEnemies) {
                    if (shouldMoveDown) {
                        enemy.y += CONFIG.VERTICAL_STEP
                    } else {
                        enemy.x += direction * CONFIG.MOVE_STEP
                    }
                }

                // Update direction for next frame
                if (shouldMoveDown) {
                    moveDirection.current = direction
                }

                return newEnemies
            })

            // Calculate speed based on lowest enemy position
            const lowestEnemyY = Math.max(...enemies.map((e) => e.y))
            const verticalProgress = Math.min(1, lowestEnemyY / CONFIG.GAME_OVER_HEIGHT)

            // Additional speed increase based on remaining enemies - more gradual
            const remainingEnemies = enemies.length
            const initialEnemies = 8 * Math.min(3 + Math.floor(level.current / 2), 5)
            const enemyCountMultiplier = 1 + ((initialEnemies - remainingEnemies) / initialEnemies) * CONFIG.ENEMY_COUNT_MULTIPLIER

            // Calculate final move interval with more gradual acceleration
            moveInterval.current = Math.max(CONFIG.MIN_MOVE_INTERVAL, CONFIG.INITIAL_MOVE_INTERVAL * (1 - verticalProgress * CONFIG.VERTICAL_SPEED_MULTIPLIER) * (1 / enemyCountMultiplier))
        }

        // Check if enemies have reached the game over height
        const lowestEnemy = enemies.reduce((lowest, enemy) => (enemy.y > lowest.y ? enemy : lowest), enemies[0])

        if (lowestEnemy && lowestEnemy.y + lowestEnemy.height >= CONFIG.GAME_OVER_HEIGHT) {
            setGameState('gameOver')
            onGameOver?.(player.score)
            return
        }

        checkGameState()
    }, [player, bullets, enemies, barricades, gameState, level, checkGameState, shoot])

    const handleBarricadeCollision = (bullet: Bullet, barricade: Barricade) => {
        const hitX = bullet.x + bullet.width / 2
        const hitY = bullet.isEnemy ? bullet.y + bullet.height : bullet.y

        // Create multiple smaller damage points for a more natural destruction
        const damagePoints = []
        const spreadRadius = 2

        // Add main damage point
        damagePoints.push({
            x: hitX - barricade.x,
            y: hitY - barricade.y,
            radius: DAMAGE_RADIUS,
        })

        // Add some random spread damage
        for (let i = 0; i < 2; i++) {
            damagePoints.push({
                x: hitX - barricade.x + (Math.random() * spreadRadius * 2 - spreadRadius),
                y: hitY - barricade.y + (Math.random() * spreadRadius * 2 - spreadRadius),
                radius: DAMAGE_RADIUS * 0.7,
            })
        }

        setBarricades((current) =>
            current.map((b) => {
                if (b === barricade) {
                    const newDamagePoints = [...b.damagePoints, ...damagePoints]
                    const newHealth = INITIAL_BARRICADE_HEALTH - newDamagePoints.length * 3
                    return {
                        ...b,
                        damagePoints: newDamagePoints,
                        health: Math.max(0, newHealth),
                    }
                }
                return b
            })
        )
    }

    const handleExplosion = (x: number, y: number) => {
        // Create an explosion effect at the given coordinates
        const explosion: Explosion = {
            active: true,
            duration: 500, // Duration in milliseconds
            startTime: Date.now(),
            x,
            y,
            width: 50,
            height: 50,
            speed: 0,
        }

        // Add explosion to the state (assuming you have a state to manage explosions)
        setExplosions((current) => [...current, explosion])
    }

    const drawGame = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

        // Draw stars with slow movement for all game states
        const now = Date.now()

        // Only update star positions every 50ms for moderate movement
        if (now - lastStarUpdate.current > 50) {
            for (let i = 0; i < starPositions.length; i++) {
                // Move stars at medium speed
                starPositions[i].y = (starPositions[i].y + 1) % GAME_HEIGHT
            }
            lastStarUpdate.current = now
        }

        // Draw the stars
        for (let i = 0; i < starPositions.length; i++) {
            const star = starPositions[i]
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
            ctx.fill()
        }

        if (gameState === 'title') {
            // Draw spooky background elements

            // Draw some floating pumpkins in the background
            // for (let i = 0; i < 5; i++) {
            //     const x = 100 + ((i * 150) % GAME_WIDTH)
            //     const y = 50 + Math.sin(Date.now() / 1000 + i) * 10
            //     const size = 15

            //     // Pumpkin body
            //     ctx.fillStyle = '#ff7700'
            //     ctx.beginPath()
            //     ctx.arc(x, y, size, 0, Math.PI * 2)
            //     ctx.fill()

            //     // Pumpkin face
            //     ctx.fillStyle = '#000'
            //     ctx.beginPath()
            //     ctx.arc(x - size / 3, y - size / 4, size / 5, 0, Math.PI * 2) // Left eye
            //     ctx.arc(x + size / 3, y - size / 4, size / 5, 0, Math.PI * 2) // Right eye
            //     ctx.fill()

            //     // Mouth
            //     ctx.beginPath()
            //     ctx.arc(x, y + size / 3, size / 3, 0, Math.PI)
            //     ctx.fill()
            // }

            // Draw title with glow effect
            const title = 'WEDDING INVADERS'

            // Draw shadow/glow
            ctx.fillStyle = '#ff6600'
            ctx.font = 'bold 44px "Creepster", cursive, Arial'
            ctx.textAlign = 'center'
            ctx.fillText(title, GAME_WIDTH / 2 + 2, 82)

            // Draw main title
            ctx.fillStyle = '#ffcc00'
            ctx.font = 'bold 44px "Creepster", cursive, Arial'
            ctx.fillText(title, GAME_WIDTH / 2, 80)

            // Draw decorative line under title
            ctx.strokeStyle = '#ff6600'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(GAME_WIDTH / 2 - 300, 100)
            ctx.lineTo(GAME_WIDTH / 2 + 300, 100)
            ctx.stroke()

            // Draw game info in panels
            const drawPanel = (x, y, width, height) => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
                ctx.fillRect(x, y, width, height)
                ctx.strokeStyle = '#ff6600'
                ctx.lineWidth = 2
                ctx.strokeRect(x, y, width, height)
            }

            // Left panel - Controls & Power-ups
            drawPanel(50, 130, 300, 320)

            // Controls section
            ctx.font = 'bold 22px Arial'
            ctx.textAlign = 'left'
            ctx.fillStyle = '#ffcc00'
            ctx.fillText('CONTROLS', 80, 160)

            // Draw arrow keys icon
            ctx.fillStyle = '#aaa'
            ctx.fillRect(80, 175, 30, 30)
            ctx.fillStyle = '#000'
            ctx.fillText('←', 88, 197)
            ctx.fillStyle = '#aaa'
            ctx.fillRect(115, 175, 30, 30)
            ctx.fillStyle = '#000'
            ctx.fillText('→', 123, 197)

            ctx.fillStyle = '#fff'
            ctx.font = '18px Arial'
            ctx.fillText('Move Ship', 160, 195)

            // Draw space bar
            ctx.fillStyle = '#aaa'
            ctx.fillRect(80, 215, 100, 25)
            ctx.fillStyle = '#000'
            ctx.font = '14px Arial'
            ctx.fillText('SPACE', 110, 232)

            ctx.fillStyle = '#fff'
            ctx.font = '18px Arial'
            ctx.fillText('Shoot', 190, 232)

            // Power-ups section
            ctx.fillStyle = '#ffcc00'
            ctx.font = 'bold 22px Arial'
            ctx.fillText('DESTROY UFOS', 80, 270)
            ctx.fillText('TO GET POWER-UPS', 80, 290)

            // Function to draw power-up with icon
            const drawPowerUp = (y, color, name, description) => {
                // Draw power-up icon
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(95, y, 10, 0, Math.PI * 2)
                ctx.fill()

                // Draw power-up name and description
                ctx.fillStyle = color
                ctx.font = 'bold 18px Arial'
                ctx.fillText(name, 115, y + 5)
                ctx.fillStyle = '#fff'
                ctx.font = '16px Arial'
                ctx.fillText(description, 115, y + 25)
            }

            drawPowerUp(310, '#ff0000', 'Beam', 'Powerful laser shot')
            drawPowerUp(360, '#00ff00', 'Spread', 'Multi-directional shots')
            drawPowerUp(410, '#0088ff', 'Shield', 'Protects from one hit')

            // Right panel - Prize & Rules
            drawPanel(450, 130, 300, 320)

            // Special prize section with trophy icon
            ctx.fillStyle = '#ffcc00'
            ctx.font = 'bold 22px Arial'
            ctx.fillText('SPECIAL PRIZE', 480, 160)

            // Draw trophy
            ctx.fillStyle = '#ffd700'
            // Trophy cup
            ctx.beginPath()
            ctx.arc(500, 185, 15, Math.PI, Math.PI * 2)
            ctx.fillRect(485, 185, 30, 20)
            // Trophy base
            ctx.fillRect(495, 205, 10, 15)
            ctx.fillRect(490, 220, 20, 5)
            ctx.fill()

            ctx.fillStyle = '#fff'
            ctx.font = '18px Arial'
            ctx.fillText('The #1 high score by', 525, 190)
            ctx.fillText('the wedding date wins!', 525, 215)

            // Game rules section
            ctx.fillStyle = '#ffcc00'
            ctx.font = 'bold 22px Arial'
            ctx.fillText('GAME RULES', 480, 260)

            ctx.fillStyle = '#fff'
            ctx.font = '18px Arial'

            // Draw bullet points with small pumpkin icons
            const drawBulletPoint = (y, text) => {
                // Small pumpkin bullet
                ctx.fillStyle = '#ff7700'
                ctx.beginPath()
                ctx.arc(490, y - 5, 6, 0, Math.PI * 2)
                ctx.fill()

                ctx.fillStyle = '#fff'
                ctx.fillText(text, 505, y)
            }

            drawBulletPoint(290, 'One hit = Game Over')
            drawBulletPoint(320, 'Destroy UFOs for power-ups')
            drawBulletPoint(350, 'Destroy all enemies')

            ctx.fillStyle = '#fff'
            ctx.font = '18px Arial'
            ctx.fillText('A crappy game by Constantine', 280, 480)

            // Draw start button
            ctx.fillStyle = '#b8860b'
            const buttonWidth = 200
            const buttonHeight = 50
            const buttonX = (GAME_WIDTH - buttonWidth) / 2
            const buttonY = GAME_HEIGHT - 100
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight)

            // Draw button text
            ctx.fillStyle = '#000'
            ctx.font = '24px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Start Game', GAME_WIDTH / 2, buttonY + 35)

            // Store button position for click detection
            startButtonRef.current = {
                x: buttonX,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight,
            }
            return
        }

        // Draw game elements
        // Draw UFO if active
        if (ufo) {
            ctx.fillStyle = ufo.powerType === 'beam' ? '#ff0000' : ufo.powerType === 'spread' ? '#00ff00' : '#0088ff'
            ctx.beginPath()
            // Draw a spooky witch on a broomstick shape
            const x = ufo.x
            const y = ufo.y
            // Witch hat
            ctx.moveTo(x + UFO_WIDTH / 2, y)
            ctx.lineTo(x + UFO_WIDTH * 0.7, y + UFO_HEIGHT * 0.4)
            ctx.lineTo(x + UFO_WIDTH * 0.3, y + UFO_HEIGHT * 0.4)
            ctx.closePath()
            ctx.fill()
            // Broomstick
            ctx.fillRect(x, y + UFO_HEIGHT * 0.6, UFO_WIDTH, UFO_HEIGHT * 0.2)
        }

        // Draw barricades with damage
        barricades.forEach((barricade) => {
            // Create a temporary canvas for the barricade
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = barricade.width
            tempCanvas.height = barricade.height
            const tempCtx = tempCanvas.getContext('2d')
            if (!tempCtx) return

            // Draw the base tombstone shape
            tempCtx.fillStyle = '#b8860b'
            tempCtx.beginPath()
            tempCtx.moveTo(0, barricade.height)
            tempCtx.lineTo(0, barricade.height / 3)
            tempCtx.quadraticCurveTo(barricade.width / 2, 0, barricade.width, barricade.height / 3)
            tempCtx.lineTo(barricade.width, barricade.height)
            tempCtx.closePath()
            tempCtx.fill()

            // Apply damage points by erasing circles
            tempCtx.globalCompositeOperation = 'destination-out'
            barricade.damagePoints.forEach((point) => {
                tempCtx.beginPath()
                tempCtx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
                tempCtx.fill()
            })

            // Draw the resulting barricade
            ctx.drawImage(tempCanvas, barricade.x, barricade.y)
        })

        // Draw bullets
        bullets.forEach((bullet) => {
            if (bullet.isBeam) {
                // Draw bright beam
                ctx.fillStyle = '#ff0000'
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
                // Add white center
                ctx.fillStyle = '#ffffff'
                const centerWidth = bullet.width * 0.4
                ctx.fillRect(bullet.x + (bullet.width - centerWidth) / 2, bullet.y, centerWidth, bullet.height)
            } else if (bullet.isSpread) {
                ctx.fillStyle = '#00ff00'
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
            } else {
                ctx.fillStyle = bullet.isEnemy ? '#ff0000' : '#fff'
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
            }
        })

        // Draw player with color based on power-up state or death animation
        if (player.dying) {
            // Death animation - draw explosion particles
            player.deathTimer--

            // Calculate fade factor (1.0 to 0.0) as animation progresses
            const fadeFactor = Math.max(0, player.deathTimer / 60)

            // Limit the maximum radius to prevent it from taking over the screen
            // Max radius of 40 pixels that fades out
            const maxRadius = 40
            const radius = maxRadius * Math.min(1, (60 - player.deathTimer) / 30) * fadeFactor

            // Only draw if we still have a visible explosion
            if (fadeFactor > 0.1) {
                // Create multiple explosion particles
                const particleCount = 12

                for (let i = 0; i < particleCount; i++) {
                    const angle = (i / particleCount) * Math.PI * 2
                    const distance = radius * (0.5 + Math.random() * 0.5)
                    const x = player.x + PLAYER_WIDTH / 2 + Math.cos(angle) * distance
                    const y = player.y + PLAYER_HEIGHT / 2 + Math.sin(angle) * distance

                    // Alternate colors for explosion with opacity based on fade factor
                    const color = i % 2 === 0 ? `rgba(255, 85, 0, ${fadeFactor})` : `rgba(255, 221, 0, ${fadeFactor})`

                    ctx.fillStyle = color
                    ctx.beginPath()
                    ctx.arc(x, y, 3 + Math.random() * 3, 0, Math.PI * 2)
                    ctx.fill()
                }

                // Draw center of explosion (orange instead of white/grey)
                ctx.fillStyle = `rgba(255, 140, 0, ${fadeFactor})`
                ctx.beginPath()
                ctx.arc(player.x + PLAYER_WIDTH / 2, player.y + PLAYER_HEIGHT / 2, radius / 3, 0, Math.PI * 2)
                ctx.fill()
            }
        } else {
            // Normal player ship
            ctx.fillStyle = player.powered ? (player.powerType === 'beam' ? '#ff0000' : player.powerType === 'spread' ? '#00ff00' : '#fff') : '#fff'
            ctx.beginPath()
            ctx.moveTo(player.x + PLAYER_WIDTH / 2, player.y)
            ctx.lineTo(player.x + PLAYER_WIDTH, player.y + PLAYER_HEIGHT)
            ctx.lineTo(player.x, player.y + PLAYER_HEIGHT)
            ctx.closePath()
            ctx.fill()
        }

        // Draw shield if active
        if (player.shielded) {
            ctx.strokeStyle = '#0088ff'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(player.x + PLAYER_WIDTH / 2, player.y + PLAYER_HEIGHT / 2, PLAYER_WIDTH * 0.8, 0, Math.PI * 2)
            ctx.stroke()
        }

        // Draw power-up if active
        if (powerUp?.active) {
            ctx.beginPath()
            switch (powerUp.type) {
                case 'beam':
                    ctx.fillStyle = '#ff0000'
                    break
                case 'spread':
                    ctx.fillStyle = '#00ff00'
                    break
                case 'shield':
                    ctx.fillStyle = '#0088ff'
                    break
            }
            ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.width / 2, 0, Math.PI * 2)
            ctx.fill()
        }

        // Draw enemies
        enemies.forEach((enemy) => {
            ctx.fillStyle = getEnemyColor(enemy.type)
            if (enemy.type === 'ghost') {
                drawGhost(ctx, enemy)
            } else if (enemy.type === 'pumpkin') {
                drawPumpkin(ctx, enemy)
            } else {
                drawBat(ctx, enemy)
            }
        })

        // Draw HUD
        ctx.fillStyle = '#fff'
        ctx.font = '20px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(`Score: ${player.score}`, 20, 30)
        ctx.fillText(`${player.shielded ? 'Shield Active' : 'No Shield'}`, 20, 60)
        ctx.fillText(`Level: ${level.current}`, 20, 90)

        // Draw explosions
        explosions.forEach((explosion) => {
            if (!explosion.active) return
            const progress = (Date.now() - explosion.startTime) / explosion.duration
            if (progress >= 1) {
                setExplosions((prev) => prev.filter((e) => e !== explosion))
                return
            }

            // Orange explosion particles instead of green
            ctx.fillStyle = `rgba(255, 140, 0, ${1 - progress})`

            // Draw circular explosion instead of rectangle
            ctx.beginPath()
            ctx.arc(explosion.x, explosion.y, (explosion.width / 2) * (1 - progress * 0.5), 0, Math.PI * 2)
            ctx.fill()
        })

        if (gameState === 'gameOver') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

            ctx.fillStyle = '#fff'
            ctx.font = '40px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 3)
            ctx.font = '24px Arial'
            ctx.fillText(`Final Score: ${player.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2)

            // Draw restart button
            ctx.fillStyle = '#4a4a4a'
            const buttonWidth = 200
            const buttonHeight = 50
            const buttonX = GAME_WIDTH / 2 - buttonWidth / 2
            const buttonY = GAME_HEIGHT / 2 + 50
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight)

            ctx.fillStyle = '#ffffff'
            ctx.font = '24px Arial'
            ctx.textAlign = 'center'
            const buttonText = 'Play Again'
            ctx.fillText(buttonText, GAME_WIDTH / 2, buttonY + 32)

            // Store button position for click detection
            restartButtonRef.current = {
                x: buttonX,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight,
            }
        }
    }, [gameState, player.score, player.lives, enemies, bullets, barricades, ufo, powerUp])

    const drawGhost = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
        ctx.beginPath()
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2 - 5, enemy.width / 2, Math.PI, 0, false)
        ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height)
        ctx.lineTo(enemy.x, enemy.y + enemy.height)
        ctx.closePath()
        ctx.fill()
    }

    const drawPumpkin = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
        ctx.beginPath()
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'black'
        // Eyes
        ctx.fillRect(enemy.x + 10, enemy.y + 15, 5, 5)
        ctx.fillRect(enemy.x + 25, enemy.y + 15, 5, 5)
        // Mouth
        ctx.fillRect(enemy.x + 15, enemy.y + 25, 10, 5)
    }

    const drawBat = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
        ctx.beginPath()
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 4, 0, Math.PI * 2)
        ctx.fill()
        // Wings
        ctx.fillRect(enemy.x, enemy.y + enemy.height / 4, enemy.width / 3, enemy.height / 2)
        ctx.fillRect(enemy.x + (2 * enemy.width) / 3, enemy.y + enemy.height / 4, enemy.width / 3, enemy.height / 2)
    }

    const getEnemyColor = (type: 'ghost' | 'pumpkin' | 'bat') => {
        switch (type) {
            case 'ghost':
                return '#ffffff'
            case 'pumpkin':
                return '#ff6b00'
            case 'bat':
                return '#4a4a4a'
        }
    }

    const gameLoop = useCallback(() => {
        updateGameState()
        drawGame()
        animationFrameRef.current = requestAnimationFrame(gameLoop)
    }, [updateGameState, drawGame])

    useEffect(() => {
        if (gameLoopStarted.current) return

        gameLoopStarted.current = true
        animationFrameRef.current = requestAnimationFrame(gameLoop)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            gameLoopStarted.current = false
        }
    }, [gameLoop])

    const startGame = useCallback(() => {
        // Reset player position and stats
        setPlayer({
            x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
            y: GAME_HEIGHT - PLAYER_HEIGHT - 10,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            speed: CONFIG.PLAYER_SPEED,
            lives: 1,
            score: 0,
            powered: false,
            powerType: undefined,
            powerTimer: 0,
            shielded: false,
            dying: false,
            deathTimer: 0,
        })

        // Initialize new barricades
        const newBarricades: Barricade[] = []
        const barricadeCount = 4
        const spacing = (GAME_WIDTH - barricadeCount * BARRICADE_WIDTH) / (barricadeCount + 1)

        for (let i = 0; i < barricadeCount; i++) {
            newBarricades.push({
                x: spacing + i * (BARRICADE_WIDTH + spacing),
                y: GAME_HEIGHT - PLAYER_HEIGHT - 100,
                width: BARRICADE_WIDTH,
                height: BARRICADE_HEIGHT,
                speed: 0,
                health: INITIAL_BARRICADE_HEALTH,
                damagePoints: [],
            })
        }
        setBarricades(newBarricades)

        // Reset game state
        setGameState('playing')
        level.current = 1
        moveDirection.current = 1
        moveInterval.current = CONFIG.INITIAL_MOVE_INTERVAL

        // Initialize level with enemies
        initializeLevel(1)
    }, [initializeLevel])

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            keysRef.current[event.key] = true

            if (event.code === 'Space') {
                event.preventDefault() // Prevent page scroll
                if (gameState === 'playing') {
                    shoot()
                }
            }

            // Testing shortcuts for powerups (only in playing state)
            /* Commented out for production
            if (gameState === 'playing') {
                // Apply beam powerup with key '1'
                if (event.key === '1') {
                    setPlayer(prev => ({ ...prev, powered: true, powerType: 'beam', powerTimer: 300 }))
                }
                // Apply spread powerup with key '2'
                else if (event.key === '2') {
                    setPlayer(prev => ({ ...prev, powered: true, powerType: 'spread', powerTimer: 300 }))
                }
                // Apply shield powerup with key '3'
                else if (event.key === '3') {
                    setPlayer(prev => ({ ...prev, powered: true, powerType: 'shield', powerTimer: 300, shielded: true }))
                }
            }
            */
        },
        [gameState, shoot]
    )

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        keysRef.current[event.key] = false
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [handleKeyDown, handleKeyUp])

    const handleCanvasClick = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (!canvasRef.current) return

            const canvas = canvasRef.current
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            if (gameState === 'title' && startButtonRef.current) {
                const button = startButtonRef.current
                if (x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height) {
                    startGame()
                }
            } else if (gameState === 'gameOver' && restartButtonRef.current) {
                const button = restartButtonRef.current
                if (x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height) {
                    startGame()
                }
            }
        },
        [gameState, startGame]
    )

    // Initialize game and show title screen
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            setGameState('title')
            // Reset everything to initial state
            setPlayer({
                x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
                y: GAME_HEIGHT - PLAYER_HEIGHT - 10,
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
                speed: CONFIG.PLAYER_SPEED,
                lives: 1,
                score: 0,
                powered: false,
                shielded: false,
                powerTimer: 0,
                dying: false,
                deathTimer: 0,
            })
            setEnemies([])
            setBullets([])
            setBarricades([])
            setUfo(null)
            setPowerUp(null)
        }
    }, [])

    return (
        <div
            style={{
                // width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000',
            }}
        >
            <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                onClick={handleCanvasClick}
                style={{
                    border: '2px solid #b8860b',
                    backgroundColor: '#000',
                }}
            />
        </div>
    )
}

export default Game
