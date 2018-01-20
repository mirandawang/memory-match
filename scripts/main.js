// Card constructor
function card(backSrc, frontSrc) {
    this.back = backSrc;
    this.front = frontSrc;
}

var c1 = new card("images/cardback.png", "images/card1.png");
var c2 = new card("images/cardback.png", "images/card2.png");
var c3 = new card("images/cardback.png", "images/card3.png");
var c4 = new card("images/cardback.png", "images/card4.png");
var c5 = new card("images/cardback.png", "images/card5.png");;
var c6 = new card("images/cardback.png", "images/card6.png");

//Three levels:
//1: Four cards
//2: Eight cards
//3: Twelve cards
var level = 1;
var cards = [c1, c1, c2, c2]; //Beginning at level 1 with 4 cards
var max_levels = 1;

$('#choose-levels').on('change',function(){
   max_levels = $(this).find(":selected").text();
});

//Points won
var score = 0;

var clicked = 0;

var startBtn = $('#start');
var timer = $('#timer');
var page = $('#container');

$( document ).ready(function() {
  startBtn.bind("click",start_game);
});

function start_game(){
  startBtn.remove(); //Remove start button
  $('#choose-levels').remove(); //Remove levels choice
  score = 0; //Reset points
  cards = shuffle(cards); //Shuffle cards

  page.append("<p id='level'></p>");
  var table = "<table id='gameboard' align='center' data-level='1'>"
  page.append(table);

  makeBoard(1, 2);
  timer.html("<script type='text/javascript'> createTimer(timer, 0); </script>");
}

// Knuth shuffle
function shuffle(array){
  var curr = 0;
  var temp;
  var random;

  while(curr < array.length){
    //Get random index
    random = Math.floor(Math.random() * curr);

    //Swap indices
    temp = array[curr];
    array[curr] = array[random];
    array[random] = temp;

    curr += 1;
  }

  return array;
}

function makeBoard(level, rows){
  $('#level').html("Level " + level);

  var board = $('#gameboard');
  var col = level == 1 ? 2 : 4; //2 cols for lv1, 4 cols for lv2 and lv3.
  var card_num = 0;
  board.attr("data-level", level);
  board.html("");

  var length = cards.length;
  var i, j;

  for(i=0; i < rows; i++){
    var row = "<tr>";
    for(j=0; j<col && card_num < length; j++){
      row += "<td id='" + card_num + "'onclick='flip("+card_num+")'><img class='card' data-flipped='false' src='" + cards[card_num].back + "'/></td>";
      card_num += 1;
    }
    row += ("</tr>");
    board.append(row);
  }
}

function fadeError(){
  $('#error').fadeOut();
  setTimeout(function(){
    $('#error').remove();
  }, 300);
}

function flip(card_num){
  var flip = new Audio('audio/click.mp3');
  flip.play();
  var id = "td#" + card_num;
  var img_id = id+" img.card";
  if($(img_id).attr("data-can-click") == "false"){
      $('#title').append("<p id='error'> You can only choose two cards at once! </p>");
      setTimeout(fadeError, 800);
  }
  if($(img_id).attr("data-flipped") == "stick" || $(img_id).attr("data-flipped") == "peek"){
    $('#title').append("<p id='error'> You have already selected this card! </p>");
    setTimeout(fadeError, 800);
  } else {
    clicked += 1;

    if(clicked <= 2){
      $(id).html("<img class='card' data-flipped='peek' src='" + cards[card_num].front + "'/>");
    }

    if(clicked == 2){
      var face_down = $('img[data-flipped="false"]');
      var length = face_down.length;
      for(var i=0; i < length; i++){
        $(face_down[i]).attr("data-can-click", "false");
      }

      setTimeout(check_match, 1500); //Let player see card before potentially flipping over
    }

  }
}

function check_match(){
  var face_down = $('img[data-flipped="false"]');
  var length = face_down.length;
  for(var i=0; i < length; i++){
    $(face_down[i]).removeAttr("data-can-click");
  }

  var flipped = $('img[data-flipped="peek"]');
  var card1 = flipped[0];
  var card2 = flipped[1];
  var card1_num = card1.src.match(/\d+/); //Get the card number from src
  var card2_num = card2.src.match(/\d+/);

  if(card1_num[0] == card2_num[0]){
    //Card stays face up
    //Detach event handler
    $(card1).attr("data-flipped", "stick");
    $(card2).attr("data-flipped", "stick");
    check_win();
  } else {
    //Cards flip back over
    $(card1).attr("data-flipped", "false");
    $(card2).attr("data-flipped", "false");
    card1.src = "images/cardback.png";
    card2.src = "images/cardback.png";
  }

  clicked = 0;
}

function check_win(){
  if($('img[data-flipped="false"]').length == 0){
    //Win!
    next_level();
  }
}

function next_level(){
  if(level >= max_levels){
    score += scorePoints(level, getSeconds());
    win();
  } else {
    level++;
  }

  if(level == 2){ //Eight cards
    cards.push(c3);
    cards.push(c3);
    cards.push(c4);
    cards.push(c4);
    cards = shuffle(cards);

    score += scorePoints(1, getSeconds());
    makeBoard(2, 2);
    resetTimer();

  }

  if (level == 3){ //Twelve cards
    cards.push(c5);
    cards.push(c5);
    cards.push(c6);
    cards.push(c6);
    cards = shuffle(cards);

    score += scorePoints(2, getSeconds());

    makeBoard(3, 3);
    resetTimer();

  }
}

function scorePoints(level, seconds){
  var deduct = 0;
  var points = 100;

  if(level == 1){
    //Start at 100 points
    //Every 3 seconds lose 3 points.
    deduct = seconds/3 * 3;
    points = points - deduct;

  }else if(level == 2){
    //Start at 100 points
    //Every 6 seconds lose 3 points.
    deduct = seconds/6 * 3;
    points = points - deduct;

  }else{
    //Start at 100 points
    //Every 12 seconds lose 3 points.
    deduct = seconds/12 * 3;
    points = points - deduct;
  }

  return points;
}

function win(){
  var win = new Audio('audio/tada.mp3');
  win.play();

  //Send score to PHP script & display leaderboard
  $.ajax({
    type: "POST",
    url: "win.php",
    data: {
        score: score,
        levels: max_levels
    },
    success: function (data) {
        page.html(data);
        timer.remove();
    }
    });
}

// For the leaderboard
function addUser(){
  var username = $('#username').val();

  $.ajax({
    type: "POST",
    url: "win.php",
    data: {
        username : username,
        levels: max_levels,
        score: score
    },
    success: function (data) {
        page.html(data);
        $('#submit').remove();
    }
    });
}
