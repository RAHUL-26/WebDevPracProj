$(document).ready(function(){

  var gamePattern=[];
  var userClickedPattern=[];

  var buttonColours = ["red", "blue", "green", "yellow"];
  var level=0;
  
  $(document).keypress(function(){
      // var sound = new Audio("sounds/"+randomChosenColour+".mp3");
      // sound.play();
      if(gamePattern.length==0){
      nextSequence();
    }
     // $("#"+randomChosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    });


  $(".btn").click(function(){
    //console.log("Clicked");
    var userChosenColour = this.id;
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    console.log(userClickedPattern);

    checkAnswer(userClickedPattern.length-1);
  });
 
   
  // var allBtn = $(".btn");
  // console.log(allBtn);
   
  // var number = generateRandom();
   
  // allBtn[number].classList.add("pressed");
  // $(document).click(function(){
  //   var sound = new Audio("sounds/"+allBtn[number].id+".mp3");
  //   sound.play();
  // });


function nextSequence(){
  level++;
  $("h1").text("Level "+level);
  
  var randomChosenColour = buttonColours[generateRandom()];
  gamePattern.push(randomChosenColour);
  playSound(randomChosenColour);
  animatePress(randomChosenColour);
  console.log(gamePattern);
  userClickedPattern=[];
}

function generateRandom()
{
    return Math.floor(Math.random()*4).toString();
}

function playSound(name)
{
  var sound = new Audio("sounds/"+name+".mp3");
  sound.play();
}

function animatePress(currentColour){
  $("#"+currentColour).addClass("pressed");
  setTimeout(function(){
    $("#"+currentColour).removeClass("pressed");
  },100);
}

function checkAnswer(currentLevel){
if(userClickedPattern[currentLevel]==gamePattern[currentLevel]){
  if(userClickedPattern.length==gamePattern.length){
    setTimeout(nextSequence,1000);
  console.log("success");
  }
}
else{
  console.log("failure");
  $("body").addClass("game-over");
  playSound("wrong");
  $("h1").text("Game Over, Press Any Key to Restart");
  setTimeout(function(){
    $("body").removeClass("game-over");
  },200);
  gamePattern=[];
  //userClickedPattern=[];
  level=0;
}
}
}
); 