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
        this.speed = 10
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
        this.position.y += this.velocity.y                      
        this.position.x += this.velocity.x    

        if (this.position.y + this.height + this.velocity.y <= canvas.height)   
        this.velocity.y += gravity                                          
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



class BackgroundElement {
    constructor({ x, y, width, height, src, parallaxFactor = 0 }) {
        this.position = {
            x,
            y
        };
        this.width = width;
        this.height = height;
        this.parallaxFactor = parallaxFactor; // Control the parallax effect speed

        this.image = new Image();
        this.image.src = src; 
    }

    draw(scrollOffset) {
        // Apply parallax by adjusting position based on scrollOffset and parallaxFactor
        const parallaxX = this.position.x - scrollOffset * this.parallaxFactor;
        c.drawImage(this.image, parallaxX, this.position.y, this.width, this.height);
    }
}



const hill = new BackgroundElement({
    x: -185, // Starting more to the left
    y: 190, // Adjusted y position
    width: 580, // Smaller width
    height: 450, // Adjusted height
    src: 'images/mariohill.webp', // Your image source
    parallaxFactor: 0.3 // Adjust this to control the speed of the hill's parallax effect
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


function init() {
player = new Player()
platforms = [new Platform({x: 0, y: 610}), new Platform({x: 200, y: 610}), new Platform({x: 400, y: 610}),  new Platform({x: 600, y: 610}),  new Platform({x: 800, y: 610}), new Platform({x: 1000, y: 610}), new Platform({x: 1200, y: 610}), new Platform({x: 1600, y: 610}), new Platform({x: 1800, y: 610}), new Platform({x: 2000, y: 610}), new Platform({x: 0, y: 610}), new Platform({x: 200, y: 610}), new Platform({x: 400, y: 610}), new Platform({x: 2500, y: 610}), new Platform({x: 2600, y: 610}), new Platform({x: 3000, y: 610}), new Platform({x: 2500, y: 610}), new Platform({x: 2600, y: 610}), new Platform({x: 3500, y: 450}), new Platform({x: 4000, y: 610}), new Platform({x: 4200, y: 610}), new Platform({x: 4400, y: 610}), new Platform({x: 4800, y: 410}), new Platform({x: 5200, y: 310}),  new Platform({x: 5500, y: 510}), new Platform({x: 5300, y: 310}), new Platform({x: 5800, y: 610}), new Platform({x: 6000, y: 610})]

backgroundImage = new Image();
backgroundImage.src = 'images/sky.jpg'

 scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    hill.draw(scrollOffset);
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    // Adjusted to prevent the player from moving left if their position is at a certain limit (e.g., starting x position)
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = player.position.x > player.width ? -player.speed : 0 // Prevent moving left if player is at or beyond the left boundary
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
        } else if (keys.left.pressed && scrollOffset > 0) { // Prevent moving the scene left if at the start
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
        }
    }

    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

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
    if (scrollOffset > 2000) {
        console.log('you win')
    }
    //loose condition
    if (player.position.y > canvas.height) {
        init()                                             //this function is going to reset the game when the player falls into the pit meaning they have to restart again
    }
}

init()
animate()

addEventListener('keydown', ({keyCode}) => {           // is a type of event that is triggered whenever a user presses a key on the keyboard. 
   // console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break

         case 87:
            console.log('up')
            player.velocity.y -= 10
            break
    }
})                  


addEventListener('keyup', ({keyCode}) => {           // is a type of event that is triggered whenever a user presses a key on the keyboard. 
    // console.log(keyCode)
     switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            break
 
        case 83:
            console.log('down')
            break
 
        case 68:
            console.log('right')
            keys.right.pressed = false

            break
 
        case 87:
            console.log('up')
            player.velocity.y -= 20
            break
    }

     console.log(keys.right.pressed)
 })                  