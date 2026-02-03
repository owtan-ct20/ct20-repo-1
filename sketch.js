let currentNote = 0;
let currentHour = 0;
let bpm = 0;
let notes = [];
let illegalPositionX = [0, 0, 0, 0];
let illegalPositionY = [0, 0, 0, 0];
let frames = 0;
let score = 0;
let great = 0;
let perfect = 0;
let miss = 0;




function setup() {
  createCanvas(800, 600);
  colorMode(HSB);
  background(220);
  currentHour = hour()
  updateBPM();
  textSize(40);
}

function draw() {
  background(220);
  frames++;
  
  if (frames == bpm){
    notes.push(new Note(minute(), second()));
    currentNote++;
    frames = 0;
    updateBPM();
  }
  if(notes.length != 0){
    for(let i = 0; i < currentNote; i++){
        notes[i].draw();
      }
    }
  
  if (currentHour != hour){ currentHour = hour();}
  
  fill(0)
  text("Score: " + score + "   Perfect: " + perfect + "  Great: " + great + "  Miss: " + miss, 10, 50);
}

//Checks on mouse click if you've hit a note and how accurately, then assigns score and rating based on accuracy. Also tells the note to terminate itself when clicked.
function mouseClicked() {
  if(currentNote > 0){
    for(let j = 0; j < currentNote; j++){
      if(dist(notes[j].x, notes[j].y, mouseX, mouseY) <= 60-minute()/2){
        if(notes[j].ringDiameter <= notes[j].d + 7 && notes[j].ringDiameter >= notes[j].d - 7){
          if(notes[j].active){
            score = score + 2;
            perfect++;
            notes[j].active = false;
          }
        } else if (notes[j].ringDiameter <= notes[j].d + 20 && notes[j].ringDiameter >= notes[j].d - 20){
            score++;
            great++;
            notes[j].active = false;
        } else {
            notes[j].active = false;
            miss++;
        }
      }
    }
  }
}

//changes the rate the notes appear based on the hour and adds a little variety based on the minute
function updateBPM() {
  bpm = (((currentHour % 4) + 1)*30) + int(random(-minute()%10, minute()%10));
}

  //checks if current note position is too close to any potential notes still active
function isIllegalPosition(xValue, yValue){
  for(let n = illegalPositionX.length; n > 0; n--){
    if(dist(illegalPositionX[n-1], illegalPositionY[n-1], xValue, yValue) <=120){
      return true;
    }
  }
  return false;
}

function Note(mins, secs) {
  this.lifetime = frameCount;
  this.deathtime = frameCount + 120;
  this.active = true;
  this.d = 120- mins;
  this.x = random(100, width-100);
  this.y = random(100, height-100);
  
  //adds position of the last 5 notes to an array to check with the isIllegalPosition function
  if(currentNote >= 5){
    for(let i = 5; i > 0; i--){
      illegalPositionX[i-1] = notes[currentNote - i].x;
      illegalPositionY[i-1] = notes[currentNote - i].y;
    }
    while(isIllegalPosition(this.x, this.y)){
        this.x = random(100, width-100);
        this.y = random(100, height-100);
      }
  }
  this.noteFill = color(secs*4, 150, 100);
  this.ringDiameter = this.d + 100;
  this.ringFill = color(0, 0, 0, 0);
  
  //draws a note that slowly disappears and disappears immediately if clicked
  this.draw = function() {
    if(this.active == false){this.lifetime = this.deathtime +1}
    if(this.lifetime < this.deathtime ){
      fill(this.noteFill);
      circle(this.x, this.y, this.d);
      fill(this.ringFill);
      circle(this.x, this.y, this.ringDiameter);
      this.ringDiameter--;
      this.lifetime++;
    } else if(this.lifetime == this.deathtime){
      this.active = false;
      miss++;
    } else {
      this.active = false;
    }
  }
}
