num_wiggle = 1
let img;


// center point
var centerX = 0.0, centerY = 0.0;

var radius = 45, rotAngle = -90;
var accelX = 0.0, accelY = 0.0;
var deltaX = 0.0, deltaY = 0.0;
var springing = 0.0009, damping = .98;

// corner nodes
var nodes = 5;

// zero fill arrays
var nodeStartX = [];
var nodeStartY = [];
var nodeX = [];
var nodeY = [];
var angle = [];
var frequency = [];

// soft-body dynamics
var organicConstant = 1.0;

// creating new array
let wiggle = []

// load background image
function preload(){
  img = loadImage('images/splatter.jpg')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // creating new "wiggles"
  for (var i=0; i<num_wiggle; i++){
    wiggle[i] = new Wiggle(random(0, 400), random(0, 400), 120, 120);
  }

  // center shape in window
  centerX = width/2;
  centerY = height/2;

  // initialize arrays to 0
  for (var i=0; i<nodes; i++){
    nodeStartX[i] = 0;
    nodeStartY[i] = 0;
    nodeY[i] = 0;
    nodeY[i] = 0;
    angle[i] = 0;
  }

  // iniitalize frequencies for corner nodes, playing with numbers chances the ways the nodes move
  for (var i=0; i<nodes; i++){
    frequency[i] = random(6, 100);
  }

  noStroke();
  frameRate(90);
}

function draw() {
  fill(0)
  rect(0,0,width, height);
  for(let i = 0; i<wiggle.length; i++){
      wiggle[i].draw(); // reflecting the length of the array that I'm creating
      wiggle[i].move();
  }
}


class Wiggle{
    constructor(tempX, tempY, tempW, tempH){
      this.x = tempX
      this.y = tempY;
      this.w = tempW;
      this.h = tempH;
    }
  
    move(){
      // move center point based on mous position, put in constructor function to define each object
      deltaX = mouseX-centerX;
      deltaY = mouseY-centerY;
       
      // create springing effect, put in constructor function to define each object
      deltaX *= springing;
      deltaY *= springing;
      accelX += deltaX;
      accelY += deltaY;
      
      // move shapes's center 
      centerX += accelX; 
      centerY += accelY;
      
      // slow down springing
      accelX *= damping;
      accelY *= damping;
      
      // change curve tightness
      organicConstant = 1-((abs(accelX)+abs(accelY))*0.3);
      
      // move nodes
      for (var i=0; i<nodes; i++){
        nodeX[i] = nodeStartX[i]+sin(radians(angle[i]))*(accelX)+this.x;
        nodeY[i] = nodeStartY[i]+sin(radians(angle[i]))*(accelY)+this.y;
        angle[i] += frequency[i];
        }
      }

    draw(){
      // establishing background photo
      image(img, 0, 0, img.width*1.7, img.height*2);

      //  calculate node  starting locations
      for (var i=0; i<nodes; i++){
        nodeStartX[i] = centerX+cos(radians(rotAngle))*radius;
        nodeStartY[i] = centerY+sin(radians(rotAngle))*radius;
        rotAngle += 360.0/nodes;
      }      
      
      // draw polygon
      curveTightness(organicConstant);
      
      fill(random(0 , 255), random (0, 255), random (0, 255));
      beginShape();
      for (var i=0; i<nodes; i++){
        curveVertex(nodeX[i], nodeY[i]);
        }
      for (var i=0; i<nodes-1; i++){
        curveVertex(nodeX[i], nodeY[i]);
        }
      endShape(CLOSE);

      // using different keys to change the rotation of the shape (specifically, the rotation of its nodes)
      if (keyCode === UP_ARROW){
        rotAngle += 100.0/nodes;
      } else rotAngle += 360.0/nodes

      if (keyCode === LEFT_ARROW){
        rotAngle += 25.0/nodes;
      }else rotAngle += 360.0/nodes

      if (keyCode === RIGHT_ARROW){
        rotAngle += 900.0/nodes
      }else rotAngle += 360.0/nodes
    }
}