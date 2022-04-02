const clueHoldTime = 1000; 
const cluePauseTime = 333; 
const nextClueWaitTime = 1000; 

var pattern = [2, 2, 4, 3, 2, 1, 2, 4]; 
var progress = 0;
var gamePlaying = false;
var tonePlaying = false; 
var volume = 1.0;
var guessCounter = 0;
function startGame(){
    progress = 0;
    gamePlaying = true;
    document.getElementById("strtBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
}
function stopGame(){
    gamePlaying = false;
    document.getElementById("strtBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}
const freqMap = {
  1: 350,
  2: 400,
  3: 550,
  4: 600
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
function lightButton(btn){
  document.getElementById("btn"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("btn"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; 
  for(let i=0;i<=progress;i++){ 
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) 
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
function loseGame(){
  stopGame();
  alert("Game Over. You lost :(.");
}
function winGame(){
  stopGame();
  alert("Game Over. You won :).");
}
function guess(btn){
  console.log("The User Guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{
    loseGame();
  }
} 