let colors = ['rgba(252, 251, 254, 100)', 'rgba(171, 134, 74, 100)', 'rgba(233, 60, 240, 100)'];
let numOfStars = 2000;
let sizeDif = 0.2;
let majorAxisMin = 10;
let widthHeightRatio = 0.7;
let rotationGradient;
let rotationGradientSlider;
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rotationGradient = PI/numOfStars;
  rotationGradientSlider = createSlider(0, rotationGradient*5, rotationGradient, 0.000001);
  for(let i=0; i < numOfStars; i++){
    const majorAxisLen = majorAxisMin + i*sizeDif;
    stars.push(new Star(majorAxisLen, colors[i%3]));
  }
}

function draw() {
  background('black');

  noFill();

  translate(width/2, height/2);

  for(let i = 0; i < numOfStars; i++){
    // ellipse draw code not galaxy
    // const majorAxisLen = majorAxisMin + i*sizeDif;
    // const minorAxisLen = majorAxisLen * widthHeightRatio;
    // stroke(colors[i%3]);
    // rotate(rotationGradientSlider.value())
    // ellipse(0, 0, majorAxisLen, minorAxisLen);
    
    //particles
    rotate(rotationGradientSlider.value());
    stars[i].display();
    stars[i].update();
  }
}

class Star {
  constructor(majorAxisLen, color){
    this.majorAxisLen = majorAxisLen;
    this.minorAxisLen = majorAxisLen * widthHeightRatio;
    this.theta = random(2*PI);
    this.lineColor = color;
    this.deltaTheta = 0.01;
  }

  display() {
    //x coordinate = a cos theta
    //a is majorAxisLen / 2
    //y coordinate = b sin theta
    //b is minorAxisLen / 2
    //These are used to allow star to move along elliptical orbit
    const x = (this.majorAxisLen/2)*cos(this.theta);
    const y = (this.minorAxisLen/2)*sin(this.theta);
    noStroke();
    fill(this.lineColor);
    circle(x, y, 2);
  }

  update(){
    this.theta = this.theta + this.deltaTheta;
  }
}