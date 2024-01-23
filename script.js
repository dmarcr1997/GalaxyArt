let colors = ['rgba(252, 251, 254, 100)', 'rgba(171, 134, 74, 100)', 'rgba(233, 60, 240, 100)'];
const State = {
  MENU: 'menu',
  GALAXY: 'galaxy',
  BLACKHOLE: 'blackhole'
};
let GRAV = 25;
let TAN_COE = 0.02;
let currentState = State.MENU;
let padW;

let numOfStars = 2000;
let sizeDif = 0.2;
let majorAxisMin = 10;
let widthHeightRatio = 0.7;
let rotationGradient;
let rotationGradientSlider;
let galaxyButton;
let blackHoleButton;
let stars = [];
let blackHole;
let eventHorizonRadius = 50;

function styleButtons() {
  // Array of colors for the button glow
  const glowColors = ['#0f0', '#00f', '#f00']; // Green, Blue, Red

  galaxyButton.style('font-family', 'Orbitron, sans-serif'); // Set the font
  galaxyButton.style('background-color', '#000'); // Dark background
  galaxyButton.style('color', '#fff'); // Bright text
  galaxyButton.style('border', '1px solid #fff'); // Light border
  galaxyButton.style('box-shadow', '0 0 20px ' + glowColors[0]); // Green glow
  galaxyButton.style('padding', '10px 20px'); // Spacing inside the button
  galaxyButton.style('cursor', 'pointer'); // Cursor pointer

  blackHoleButton.style('font-family', 'Orbitron, sans-serif'); // Set the font
  blackHoleButton.style('background-color', '#000'); // Dark background
  blackHoleButton.style('color', '#fff'); // Bright text
  blackHoleButton.style('border', '1px solid #fff'); // Light border
  blackHoleButton.style('box-shadow', '0 0 20px ' + glowColors[1]); // Blue glow
  blackHoleButton.style('padding', '10px 20px'); // Spacing inside the button
  blackHoleButton.style('cursor', 'pointer'); // Cursor pointer
}

function styleSlider() {
  // Use similar color themes as the buttons for consistency
  const sliderThumbColor = '#fff'; // White
  const sliderTrackColor = '#333'; // Dark Gray
  const sliderGlowColor = '#0f0'; // Green

  rotationGradientSlider.style('appearance', 'none'); // Remove default styling
  rotationGradientSlider.style('width', '400px'); // Width of the slider
  rotationGradientSlider.style('height', '5px'); // Height of the track
  rotationGradientSlider.style('background', sliderTrackColor); // Track color
  rotationGradientSlider.style('outline', 'none'); // Remove outline
  rotationGradientSlider.style('opacity', '0.7'); // Partial transparency
  rotationGradientSlider.style('transition', 'opacity 0.2s'); // Smooth transition for hover effect

  // Slider Thumb
  rotationGradientSlider.style('cursor', 'pointer'); // Cursor pointer
  rotationGradientSlider.style('-webkit-slider-thumb', 'appearance: none'); // Remove default thumb
  rotationGradientSlider.style('appearance', 'none');
  rotationGradientSlider.style('width', '25px'); // Thumb width
  rotationGradientSlider.style('height', '25px'); // Thumb height
  rotationGradientSlider.style('background', sliderThumbColor); // Thumb color
  rotationGradientSlider.style('box-shadow', '0 0 10px ' + sliderGlowColor); // Glow effect
  rotationGradientSlider.style('border-radius', '50%'); // Circular thumb

  // Hover effect for the slider
  rotationGradientSlider.mouseOver(() => rotationGradientSlider.style('opacity', '1'));
  rotationGradientSlider.mouseOut(() => rotationGradientSlider.style('opacity', '0.7'));
}

function setup() {
  createCanvas(windowWidth, windowHeight - 50);
  padW = windowWidth * .02
  galaxyButton = createButton('Galaxy');
  galaxyButton.position(padW, 20);
  galaxyButton.mousePressed(() => {
    currentState = State.GALAXY
    resetSketch();
  }); // Change state to GALAXY

  blackHoleButton = createButton('Black Hole');
  blackHoleButton.position(padW, 70); // Adjust position based on your layout
  blackHoleButton.mousePressed(() => {
    currentState = State.BLACKHOLE
    resetSketch();
  }); // Change state to BLACKHOLE

  styleButtons();

}
function resetSketch() {
  clear(); // Clear the canvas
  if (rotationGradientSlider) {
    rotationGradientSlider.remove();
  }
  if (currentState === State.GALAXY) {
    initGalaxy();
  } else if (currentState === State.BLACKHOLE) {
    initBlackhole();
  }
}

function initGalaxy() {

  rotationGradient = PI / numOfStars;
  rotationGradientSlider = createSlider(0, rotationGradient * 5, rotationGradient, 0.000001);
  styleSlider();
  stars = [];
  for (let i = 0; i < numOfStars; i++) {
    const majorAxisLen = majorAxisMin + i * sizeDif;
    stars.push(new Star(majorAxisLen, colors[i % 3]));
  }
}

function initBlackhole() {
  blackHole = new BlackHole(width / 2, height / 2, 20, eventHorizonRadius, GRAV); // Initialize the black hole
  stars = []; // Reset or initialize stars array for black hole state
  for (let i = 0; i < numOfStars * 4; i++) {
    let angle = random(TWO_PI);
    let distance = random(60, width / 4); // Ensure stars are not too close initially
    if (distance < 1) distance = 1;
    let starX = blackHole.x + cos(angle) * distance;
    let starY = blackHole.y + sin(angle) * distance;
    let tangentialVelocity = sqrt(blackHole.gravitationalStrength) * TAN_COE;
    let dx = cos(angle);
    let dy = sin(angle);

    stars.push(new Star(majorAxisMin + i * sizeDif, colors[i % 3], starX, starY, tangentialVelocity * dy, tangentialVelocity * dx));
  }
}

function draw() {
  background('black');
  noFill();
  if (currentState === State.MENU) {
    // Show the buttons only in the MENU state
    galaxyButton.show();
    blackHoleButton.show();
  } else if (currentState === State.GALAXY) {
    galaxyButton.hide();
    blackHoleButton.show();
    translate(width / 2, height / 2);

    for (let i = 0; i < numOfStars; i++) {
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
  } else {
    galaxyButton.show();
    blackHoleButton.hide();
    blackHole.display();
    // blackHole.pullStars(stars);

    for (let i = stars.length - 1; i >= 0; i--) {
      let star = stars[i];
      star.update(blackHole);
      star.display();

      if (blackHole.isStarInsideEventHorizon(star)) {
        stars.splice(i, 1);
      }
    }
  }
}

class Star {
  constructor(majorAxisLen, color, x, y, vx, vy) {
    this.majorAxisLen = majorAxisLen;
    this.minorAxisLen = majorAxisLen * widthHeightRatio;
    this.theta = random(2 * PI);
    this.lineColor = color;
    this.deltaTheta = random(-0.01, 0.01);
    this.x = x || random(width);
    this.y = y || random(height);
    this.vx = vx || 0;
    this.vy = vy || 0;
  }

  display() {
    //x coordinate = a cos theta
    //a is majorAxisLen / 2
    //y coordinate = b sin theta
    //b is minorAxisLen / 2
    //These are used to allow star to move along elliptical orbit
    if (currentState === State.GALAXY) {
      const x = (this.majorAxisLen / 2) * cos(this.theta);
      const y = (this.minorAxisLen / 2) * sin(this.theta);
      noStroke();
      fill(this.lineColor);
      circle(x, y, 2);
    } else if (currentState === State.BLACKHOLE) {
      noStroke();
      fill(this.lineColor);
      circle(this.x, this.y, 2);
    }
  }

  update(blackHole) {
    if (blackHole) {
      this.x += this.vx;
      this.y += this.vy;
      this.theta += this.deltaTheta;
      let dx = this.x - blackHole.x;
      let dy = this.y - blackHole.y;
      let distance = sqrt(dx * dx + dy * dy);
      if (distance < 1) distance = 1;

      let force = blackHole.gravitationalStrength / (distance * distance);
      this.vx -= force * dx / distance;
      this.vy -= force * dy / distance;
    } else {
      this.theta += this.deltaTheta;
    }
  }
}

class BlackHole {
  constructor(x, y, radius, eventHorizRadius, gravitationalStrength) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.eventHorizonRadius = eventHorizRadius;
    this.gravitationalStrength = gravitationalStrength || 5;
  }

  display() {
    fill(0);
    noStroke();
    ellipse(this.x, this.y, this.eventHorizonRadius * 2 + 10, this.eventHorizonRadius * 2);
    noFill();
    stroke(255, 255, 0);
    ellipse(this.x, this.y, this.eventHorizonRadius * 2 + 10, this.eventHorizonRadius * 2 + 10);
  }
  pullStars(stars) {
    // Apply gravitational pull to the stars
    for (let star of stars) {
      let dx = star.x - this.x;
      let dy = star.y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      if (distance < 1) distance = 1;

      let force = this.gravitationalStrength / (distance * distance);

      // Apply the gravitational force to the star's velocity
      star.vx -= force * dx / distance;
      star.vy -= force * dy / distance;
    }
  }

  isStarInsideEventHorizon(star) {
    let dx = this.x - star.x;
    let dy = this.y - star.y;
    let distance = sqrt(dx * dx + dy * dy);
    return distance < this.eventHorizonRadius;
  }
}