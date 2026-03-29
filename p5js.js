var inc = 10;
var scl = 20;
var cols, rows;

var zOff = 0;

var particles = [];

var flowfield;

var colorInc = 0.5;
var sat = 100;
var brt = 90;
var alph = 20;
var numberPart = 200;
var partStroke = 1;
var angMult = 25;
var angTurn = 1;
var zOffInc = 0.0003;
var p = 1;
var hu = 1;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 359, 100, 100, 100);
  
  cols = floor(width / scl);
  rows = floor(height / scl);
  
  flowfield = new Array(cols * rows)
  
  for (var i = 0; i < numberPart; i++)    {
    particles[i] = new Particle();
  }
    background(0);
}

function draw() {
  if (p > 0) {
    var yOff = 0;
    for (var y = 0; y < rows; y++) {
      var xOff = 0;
    for (var x = 0; x < cols; x++) {
      var index = (x + y * cols);
      var angle = noise(xOff, yOff, zOff) * angMult + angTurn;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v; 
      xOff += inc;
  }
    yOff += inc; 
    zOff += 0.0003;
  }    
    
    for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges(); 
    particles[i].show();
  }
    hu += colorInc; if (hu > 359) {hu = 0}
  }
  
}

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0,0)
    this.acc = createVector(0,0);
    this.maxspeed = 4;
    this.prevPos = this.pos.copy();
  

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force); 
  }
  
  this.applyForce = function(force) {
    this.acc.add(force); 
  }
  
  this.show = function() {
    stroke(hu, sat, brt, alph);
    strokeWeight(partStroke);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();    
  }
  
  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
  
  this.edges = function() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    } 
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    } 
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    } 
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    } 
  }
}
