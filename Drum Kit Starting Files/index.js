var buttons = document.querySelectorAll(".drum");
console.log(button);

for(var i=0;i<buttons.length;i++)
{
    var button =buttons[i];
    button.addEventListener("click",
    function clicked()
    {
       var val = this.innerHTML;
       // console.log(val);
       playSound(val);
       animateBtn(val);
    });

   
}

document.addEventListener('keydown',function(event){
    var key = event.key;
   // console.log(key);
    playSound(key);
    animateBtn(key);
});


function playSound(selected)
{

    switch (selected)
    {
        case 'w':
            var sound = new Audio("sounds/tom-1.mp3");
            sound.play();
            break;
        case 'a':
            var sound = new Audio("sounds/tom-2.mp3");
            sound.play();
            break;
        case 's':
            var sound = new Audio("sounds/tom-3.mp3");
            sound.play();
            break;
        case 'd':
            var sound = new Audio("sounds/tom-4.mp3");
            sound.play();
            break;
        case 'j':
            var sound = new Audio("sounds/snare.mp3");
            sound.play();
            break;
        case 'k':
            var sound = new Audio("sounds/kick-bass.mp3");
            sound.play();
            break;
        case 'l':
            var sound = new Audio("sounds/crash.mp3");
            sound.play();
            break;
        default:
            console.log(selected);
            break;    
    }
    
}

function animateBtn(selected)
{
    var box = document.querySelector("."+selected);
    console.log(box);
    box.classList.add("pressed");
    setTimeout(function(){
        box.classList.remove("pressed");
    },150);
    
}