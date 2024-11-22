let teaParticles = [];
let waveOffset = 0;
let waveHeight = 20;
let stirringIntensity = 0;
let splashDrops = [];
let maxParticles = 150;
let splashCount = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < maxParticles; i++) {
    teaParticles.push(new TeaParticle(random(width), random(height)));
  }
  noCursor();
}

function draw() {
  background(240, 190, 140);
  
  drawWave();

  for (let particle of teaParticles) {
    particle.update();
    particle.display();
  }

  for (let splash of splashDrops) {
    splash.update();
    splash.display();
  }

  splashDrops = splashDrops.filter(splash => !splash.finished());

  stirringIntensity = constrain(map(dist(mouseX, mouseY, pmouseX, pmouseY), 0, 50, 0, 1), 0, 1);
}

function mousePressed() {
  for (let i = 0; i < splashCount; i++) {
    splashDrops.push(new Splash(mouseX, mouseY));
  }
}

function drawWave() {
  noStroke();
  fill(220, 170, 120);
  beginShape();
  for (let x = 0; x <= width; x += 10) {
    let y = height / 2 + sin((x + waveOffset) * 0.05) * waveHeight;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  waveOffset += 2 * stirringIntensity;
}

class TeaParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.originalPos = this.pos.copy();
    this.size = random(5, 15);
    this.angle = random(TWO_PI);
    this.speed = random(0.5, 2);
  }

  update() {
    let dir = createVector(mouseX - width / 2, mouseY - height / 2);
    dir.setMag(this.speed * stirringIntensity);
    this.pos.add(dir);
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    if (dist(this.pos.x, this.pos.y, width / 2, height / 2) > height / 2) {
      this.pos = this.originalPos.copy();
    }
  }

  display() {
    fill(150, 100, 70, 150);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class Splash {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(5, 15));
    this.size = random(8, 15);
    this.lifetime = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.95);
    this.size *= 0.95;
    this.lifetime -= 5;
  }

  display() {
    fill(100, 60, 40, this.lifetime);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  finished() {
    return this.lifetime <= 0 || this.size < 1;
  }
}
