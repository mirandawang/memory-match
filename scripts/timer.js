var timer;
var totalMin;
var totalSec;

function createTimer(timer, time){
  timer = timer;
  totalMin = time/60;
  totalSec = time%60;

  updateTimer();
  window.setInterval("tick()", 1000);
}

function getSeconds(){
  return totalMin*60 + totalSec;
}

function tick(){
  totalSec += 1;
  updateTimer();
}

function updateTimer(){
  if(totalSec > 60){
    totalMin = parseInt(totalSec/60);
    totalSec = totalSec%60;
  }
  timer.html(formatTime(totalMin) + ":" + formatTime(totalSec));
}

function formatTime(n){
  //Formats time to have double digits
    if(n > 9){
      return ""+n;
    }
    return "0"+n;
}

function resetTimer(){
  totalMin = 0;
  totalSec = 0;
  updateTimer();
}
