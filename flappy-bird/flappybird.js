// let canvas = document.querySelector('#canvas')
// canvas
let canvas;
let canvasWidth = 360;
let canvasHeight = 640;
let context;

//lferkh: bird
let birdWidth = 34; // the bird image is 408/228 = (khtizal)17/12 =>*2 / 34/24
let birdHeight = 24;
let birdX = canvasWidth/8;
let birdY = canvasHeight/2;
let birdImg;

let bird= {
    x : birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}
// pipe
let pipeArray = [];
let pipeWidth = 64; // width to height ratio = 384/3072 = 1/8 times 64 = 64/512
let pipeHeight = 512
let pipeX = canvasWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

//game physics
let movingSpeedX = -2 //pipes moving left Speed
let jumpY = 0
let gravity = 0.4

let gameOver = false
let score = 0;



const update = function(){
    requestAnimationFrame(update)
    if(gameOver)
        return;
    context.clearRect(0, 0, canvas.width, canvas.height)
    // draw bird
    jumpY += gravity
    bird.y = Math.max(bird.y + jumpY, 0) //if(bird.y + jumpY > 0) : bird is above the canvas top , return 0 to stay on the top
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    // if bird reached bottom
    if(bird.y + bird.height >= canvas.height)
        gameOver = true
    // draw pipes
    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i]
        pipe.x += movingSpeedX // -2
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)
        // score counting
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5 // cuz 2 pipe 0.5 + 0.5 = 1
            pipe.passed = true
        }
        if(collision(bird, pipe))
            gameOver = true
    }
    //clear pipes after they are out of frame | pipeArray[0].x + pipeArray[0].width < 0 or pipeArray[0].x < - pipeWidth
    while(pipeArray.length > 0 && pipeArray[0].x + pipeArray[0].width < 0){
        pipeArray.shift()
    }

    // printing score
    context.fillStyle = "white"
    context.font = "40px sans-serif"
    context.fillText(score, 5, 50)
    if(gameOver){
        context.fillText("GAME OVER G", 5, 90)
    }

}

const placePipes = function(){
    //
    // if(gameOver)
    //     return;
    // random(0 - 1) 0: - pipeHeight/4 = - 1/4 | 1: - 3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)
    let openingSpace = canvas.height/4

    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe)

    let bottompipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace, // result dial y ghadi tji lte7t(prc pos:0,0 rah lfo9 ) ex: 540px u mn hed lte7t ghadi trssem imageheight li huwa 512
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottompipe)
}

const moveBirdUp = function(k){
    if(k.code == "Space" || k.code == "ArrowUp"){
        // bird jump
        jumpY = -6
        //reset the game
        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}
const collision = function(bird, pipe){
    // bird and pipe position
    let birdLeft = bird.x
    let birdRight = bird.x + bird.width
    let birdTop = bird.y
    let birdBottom = bird.y + bird.height

    let pipeTop = pipe.y
    let pipeBottom = pipe.y + pipe.height
    let pipeLeft = pipe.x
    let pipeRight = pipe.x + pipe.width

    return  birdRight > pipeLeft &&
            birdLeft < pipeRight &&
            birdBottom > pipeTop &&
            birdTop < pipeBottom
}

window.onload = function(){
    canvas = document.getElementById("canvas");
    canvas.height = canvasHeight;
    canvas.width =  canvasWidth;
    context = canvas.getContext("2d"); //to draw in the canvas

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // load  bird image
    birdImg = new Image()
    birdImg.src = "./flappybird.png"
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }

    topPipeImage = new Image()
    topPipeImage.src = "./toppipe.png"

    bottomPipeImage = new Image()
    bottomPipeImage.src = "./bottompipe.png"
    requestAnimationFrame(update)
    setInterval(placePipes, 1500) //mseconds
    document.addEventListener("keydown", moveBirdUp)
}