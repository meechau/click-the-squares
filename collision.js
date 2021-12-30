    
let canvas;
let context;

window.onload = init;



function init() {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  createWorld();
  clicker();
}


let xVal = 0;
let yVal = 0;
let points = 0;
let pointsAwarded = 0;

function updateInfo() {
  let elemLeft = canvas.offsetLeft;
  let elemTop = canvas.offsetTop;
  xVal = event.clientX - elemLeft;
  yVal = event.clientY - elemTop; 
}

function addPoints() {
  points += parseInt(pointsAwarded);
  pointsAwarded = 0;
  document.getElementById("points").innerHTML = "You have " + points + " points ";

  if (totalPoints === 0) {
    percentagePoints = 0;
  } else {
    percentagePoints = (points / totalPoints * 100).toFixed(0);
  }


  document.getElementById("totalPoints").innerHTML = "out of " + totalPoints + " (" + percentagePoints + "% completed).";

}

function clicker() {
  canvas.addEventListener('mousedown', updateInfo);
}


function draw() {
  drawRectangle(100, 50, 200, 200, '#ff8080')
  drawCircle(200, 141.5, 50, '#0099b0')
  drawLine(100, 50, 300, 250, 'red')
  drawTriangle(200, 92, 300, 150, 300, 50, 'green')
  drawText('black', 300, 300, 'example text')
  drawMovingRectangle('#ff6666', rectX, rectY);
}


//static components

function drawRectangle(coordinateX, coordinateY, width, height, color) {
  context.fillStyle = color;
  context.fillRect(coordinateX, coordinateY, width, height);
}


function drawText(color, coordinateX, coordinateY, actualText) {
  context.font = '25px Arial';
  context.fillStyle = color;
  context.fillText(actualText, coordinateX, coordinateY);
}

/*  
function drawCircle(coordinateX, coordinateY, radius, color) {
  context.beginPath();
  context.arc(coordinateX, coordinateY, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
}

function drawLine(startX, startY, endX, endY, color) {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.strokeStyle = color;
  context.stroke();
}

function randomizeColors() {
  randomNumber = Math.random()
  randomColor = randomNumber > 0.5? '#ff8080' : '#0099b0';
  randomOppositeColor = randomNumber < 0.5? '#ff8080' : '#0099b0';
}

function drawTriangle(startX, startY, middleX, middleY, endX, endY, color) {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(middleX, middleY);
  context.lineTo(endX, endY);
  context.fillStyle = color;
  context.fill();
}

*/

//moving components

let rectX = 0;
let rectY = 0;

let secondsPassed = 0;
let oldTimeStamp = 0;
let fps;
let movingSpeed = 20;


// Loop

function gameLoop(timeStamp) {

    // Update game objects in the loop
    update(secondsPassed);

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    detectCollisions();
    detectClicks();
    destroyRectangle();
    addPoints();

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    // Track time between frames
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.02);
    oldTimeStamp = timeStamp;

    // Update fps
    fps = Math.round(1 / secondsPassed);
    document.getElementById("fps").innerHTML = "fps: " + fps;

    // Loop
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);


function update(secondsPassed) {
    rectX += (secondsPassed * movingSpeed);
    rectY += (secondsPassed * movingSpeed);
}


function drawMovingRectangle(color, rectX, rectY) {
  context.fillStyle = color;
  context.fillRect(rectX, rectY, 150, 100);
}



class MovingRectangle {

  static width = 40;
  static height = 40;

  constructor (x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.points = ((Math.abs(vx) + Math.abs(vy)) / 2).toFixed(0);

    this.isColliding = false;
    this.isClicked = false;
  }

  update(secondsPassed) {
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;
  }

  draw() {
    context.fillStyle = this.isColliding?'red':'green';
    context.fillRect(this.x, this.y, MovingRectangle.width, MovingRectangle.height);
    drawText('white', this.x + 5, this.y + 28, this.points);
  }
}

let gameObjects;
let totalPoints = 0;
let percentagePoints = 0;

function createWorld() {

// Find center of the canvas
  let centerX = canvas.width / 2 - 25;
  let centerY = canvas.height / 2 - 25;

  gameObjects = [];

/* test objects
    new MovingRectangle(250, 50, 0, 0),
    new MovingRectangle(250, 300, 0, -50),
    new MovingRectangle(150, 0, 10, 10),
    new MovingRectangle(250, 0, -10, 10),
*/

// Add new object
  function pushRectangle() {
    let speedX = getRndInteger(-50, 50);
    let speedY = getRndInteger(-50, 50);
    let newRectangle = new MovingRectangle(centerX, centerY, speedX, speedY);
    gameObjects.push(newRectangle);
  }
// How many new objects
  for (let i = 0; i < 32; i++) {
  pushRectangle();
  }
// Count all possible points
  for (let i = 0; i < gameObjects.length; i++) {
    totalPoints += parseInt(gameObjects[i].points);
  }


// Add 4 objects up to a total worth of 1000 points
  let missingPoints = 1000 - totalPoints;
  function pushAdditionalRectangles() {
    missingPointsAverage = missingPoints / 2;

//1
    let additionalRectangle = new MovingRectangle(centerX, centerY, -missingPointsAverage, 0);
    gameObjects.push(additionalRectangle);
    totalPoints += parseInt(additionalRectangle.points);
//2
    additionalRectangle = new MovingRectangle(centerX, centerY, 0, -missingPointsAverage);
    gameObjects.push(additionalRectangle);
    totalPoints += parseInt(additionalRectangle.points);
//3
    additionalRectangle = new MovingRectangle(centerX, centerY, 0, missingPointsAverage);
    gameObjects.push(additionalRectangle);
    totalPoints += parseInt(additionalRectangle.points);
//4
    additionalRectangle = new MovingRectangle(centerX, centerY, missingPointsAverage, 0);
    gameObjects.push(additionalRectangle);
    totalPoints += parseInt(additionalRectangle.points);
  }
  pushAdditionalRectangles();
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


// Click detection system
function detectClicks() {
  let obj;
  for (let i = gameObjects.length; i > 0; i--) {
    obj = gameObjects[i - 1];
    if (clickIntersect(xVal, yVal, obj.x, obj.y, 40, 40)) {
      obj.isClicked = true;
      pointsAwarded = obj.points;
      xVal = -1000;
      yVal = -1000;
    }
  }
}


function clickIntersect(xM, yM, xo, yo, wo, ho) {
  if (xM > xo + wo || yM > yo + ho || xo > xM || yo > yM) {
    return false;
  } else {
  return true;
  }
}

function destroyRectangle() {
  let obje;
  for (let i = 0; i < gameObjects.length; i++) {
    obje = gameObjects[i];
    if (obje.isClicked) {
      gameObjects.splice(i, 1);
    }
  }
}



// Collision detection system
function detectCollisions(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];

            // Compare object1 with object2
            if (rectIntersect(obj1.x, obj1.y, MovingRectangle.width, MovingRectangle.height, obj2.x, obj2.y, MovingRectangle.width, MovingRectangle.height)){
                obj1.isColliding = true;
                obj2.isColliding = true;
            }
        }
    }
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap

    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    } else {
    return true;
    }
}


document.getElementById('tryAgain').addEventListener('click', function reset() {
  gameObjects = [];
  totalPoints = 0;
  points = 0;
  createWorld();
});