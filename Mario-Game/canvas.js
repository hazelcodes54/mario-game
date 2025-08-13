const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')   
const spriteRunLeft = new Image();
spriteRunLeft.src = 'images/spriteRunLeft.png';

const spriteRunRight = new Image();
spriteRunRight.src = 'images/spriteRunRight.png';

const spriteStandLeft = new Image(); 
spriteStandLeft.src = 'images/spriteStandLeft.png'; 

const spriteStandRight = new Image();
spriteStandRight.src = 'images/spriteStandRight.png'; 


canvas.width = 1400     
canvas.height = 800

//create a player using a class
const gravity = 1.5

class Player {
    constructor() {
        this.speed = 7  // Changed from 10 to 7
        this.position = {
            x: 100,
            y: 200
        } 
        this.velocity = {          
            x: 0,
            y: 1
        }
        this.width = 66;
        this.height = 150;

        this.image = spriteStandRight; 
        this.frames = 0
        this.sprites = {
            stand: {
                right: spriteStandRight,
                left: spriteStandLeft,
                cropWidth: 177,
                width: 66
            },
            run: {
                right: spriteRunRight,
                left: spriteRunLeft,
                cropWidth: 341,
                width: 127.875
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage (
            this.currentSprite, 
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );
    }

    update() {
        this.frames++
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left))
            this.frames = 0
        else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left))
            this.frames = 0
        
        this.draw(c);
        
        // Update position first
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Check if player is falling below canvas
        if (this.position.y > canvas.height) {
            gameState = 'lose';
            showOverlay('You Lose!');
            return;
        }

        // Apply gravity only if not on a platform
        let onPlatform = false;
        platforms.forEach(platform => {
            if (this.position.y + this.height <= platform.position.y && 
                this.position.y + this.height + this.velocity.y >= platform.position.y && 
                this.position.x + this.width >= platform.position.x && 
                this.position.x <= platform.position.x + platform.width) {
                onPlatform = true;
                this.velocity.y = 0;
                this.position.y = platform.position.y - this.height;
            }
        });

        if (!onPlatform) {
            this.velocity.y += gravity;
        }
    }
}


class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = 200
        this.height = 200

        
        this.image = new Image();
        this.image.src = 'images/wall.webp';
        this.image.onload = () => {

        };
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}



// First, modify the BackgroundElement class to remove the parallax:
class BackgroundElement {
    constructor({ x, y, width, height, src }) {
        this.position = {
            x,
            y
        };
        this.width = width;
        this.height = height;

        this.image = new Image();
        this.image.src = src; 
    }

    draw() {
        // Remove scrollOffset parameter and parallax calculation
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}

// Update the hill initialization:
const hill = new BackgroundElement({
    x: -185,
    y: 190,
    width: 580,
    height: 450,
    src: 'images/mariohill.webp'
});



let player = new Player()
let platforms = [

]

let backgroundImage = new Image();
backgroundImage.src = 'images/sky.jpg'

let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
}

let scrollOffset = 0

// Add this at the top with your other constants
let gameStarted = false;

// Add after your existing variables
let decorations = []

// First, create a variable to store initial decoration positions
let initialDecorationPositions = [];

// Modify the init function to store initial positions
function init() {
    gameState = 'playing';
    player = new Player()
    platforms = [
        // Starting platforms
        new Platform({x: 0, y: 610}),
        new Platform({x: 200, y: 610}),
        new Platform({x: 400, y: 610}),
        
        // First gap
        new Platform({x: 800, y: 610}),
        
        // Elevated platforms
        new Platform({x: 1000, y: 450}),
        new Platform({x: 1200, y: 450}),
        
        // Jump down platforms
        new Platform({x: 1500, y: 610}),
        new Platform({x: 1700, y: 610}),
        
        // Stair-like platforms
        new Platform({x: 2000, y: 550}),
        new Platform({x: 2200, y: 450}),
        new Platform({x: 2400, y: 350}),
        
        // Long gap with single platform
        new Platform({x: 2800, y: 400}),
        
        // Platform series at different heights
        new Platform({x: 3200, y: 610}),
        new Platform({x: 3400, y: 500}),
        new Platform({x: 3600, y: 400}),
        new Platform({x: 3800, y: 300}),
        new Platform({x: 4000, y: 400}),
        new Platform({x: 4200, y: 500}),
        
        // Final stretch
        new Platform({x: 4600, y: 610}),
        new Platform({x: 4800, y: 610}),
        new Platform({x: 5000, y: 610}),
        
        // Victory platform
        new Platform({x: 5400, y: 610}),
        new Platform({x: 5600, y: 610})
    ]

    decorations = [
        new Decoration({ x: 300, y: 560 }),
        new Decoration({ x: 850, y: 560 }),
        new Decoration({ x: 1050, y: 400 }),
        new Decoration({ x: 1250, y: 400 }),
        new Decoration({ x: 2050, y: 500 }),
        new Decoration({ x: 2250, y: 400 }),
        new Decoration({ x: 2450, y: 300 }),
        new Decoration({ x: 5000, y: 560 })
    ]
    
    // Store initial positions
    initialDecorationPositions = decorations.map(dec => ({
        x: dec.position.x,
        y: dec.position.y
    }));
    
    backgroundImage = new Image();
    backgroundImage.src = 'images/sky.jpg'

    scrollOffset = 0
}

let animationId;

// Update the animate function
function animate() {
    if (!gameStarted || gameState !== 'playing') return;
    
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'white'
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background and hill only once
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    hill.draw();
    
    platforms.forEach(platform => {
        platform.draw()
    })
    
    // Update decoration positions based on scroll offset
    decorations.forEach((decoration, index) => {
        decoration.position.x = initialDecorationPositions[index].x - scrollOffset;
        decoration.draw();
    });
    
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = player.position.x > player.width ? -player.speed : 0
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            // Remove hill.draw(scrollOffset) from here
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            // Remove hill.draw(scrollOffset) from here
        }
    }

    //sprite switching

    if (
        keys.right.pressed &&
        lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        keys.left.pressed &&
        lastKey === 'left' && player.currentSprite !== player.sprites.run.left
    ) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        !keys.left.pressed &&
        lastKey === 'left' && player.currentSprite !== player.sprites.stand.left
    ) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }
    else if (
        !keys.right.pressed &&
        lastKey === 'right' && player.currentSprite !== player.sprites.stand.right
    ) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }


    //win condition
    if (scrollOffset > 5000) {
        gameState = 'win';
        showOverlay('You Win!');
        return;
    }
    //lose condition
    if (player.position.y > canvas.height) {
        gameState = 'lose';
        showOverlay('You Lose!');
        return;
    }

    // Remove this line:
    // checkEnemyCollision()
}

// Overlay state
let gameState = 'playing'; // 'playing', 'win', 'lose'

function showOverlay(message) {
    let overlay = document.getElementById('game-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'game-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
        overlay.style.color = 'white';
        overlay.style.fontSize = '3em';
        document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = `<div>${message}</div><button id='restart-btn' style='margin-top:30px;font-size:1em;padding:10px 30px;'>Restart</button>`;
    overlay.style.display = 'flex';
    
    document.getElementById('restart-btn').onclick = () => {
        cancelAnimationFrame(animationId);
        overlay.style.display = 'none';
        gameState = 'playing';
        gameStarted = true;
        init();
        animate();
    };
}

// Remove or comment out these lines
// init()
// animate()

document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    gameStarted = true;
    init();
    animate();
});

addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 65: // A key
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break
        case 83: // S key
            console.log('down')
            break
        case 68: // D key
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break
        case 87: // W key
            console.log('up')
            if (player.velocity.y === 0) {
                player.velocity.y = -20  // Changed from -15 to -20 for higher jump
            }
            break
    }
})

addEventListener('keyup', ({keyCode}) => {
    switch (keyCode) {
        case 65: // A key
            console.log('left')
            keys.left.pressed = false
            break
        case 83: // S key
            console.log('down')
            break
        case 68: // D key
            console.log('right')
            keys.right.pressed = false
            break
        case 87: // W key
            console.log('up')
            if (player.velocity.y < -10) {  // Changed from -7 to -10
                player.velocity.y = -10
            }
            break
    }
})
 // Add after your existing classes
class Enemy {
    constructor({ x, y }) {
        this.position = {
            x,
            y
        }
        this.width = 50
        this.height = 50
        
        // Load enemy image
        this.image = new Image()
        this.image.src = 'images/mushroom.webp'
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
    }
}

// Add this inside animate() before the win condition
function checkEnemyCollision() {
    decorations.forEach(decoration => {
        if (
            player.position.x < decoration.position.x + decoration.width &&
            player.position.x + player.width > decoration.position.x &&
            player.position.y < decoration.position.y + decoration.height &&
            player.position.y + player.height > decoration.position.y
        ) {
            gameState = 'lose'
            showOverlay('Game Over - Hit by Enemy!')
        }
    })
}

class Decoration {
    constructor({ x, y }) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 50
        this.height = 50
        
        this.image = new Image()
        this.image.src = 'images/mushroom.webp'
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}