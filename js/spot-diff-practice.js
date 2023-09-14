import { updatePracticeTime} from "./user.js";

//code for the timer at the top-left of the page
//relevant credits: https://codepen.io/reynnor/pen/vmNaeM 
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

setInterval(setTime, 1000);

function setTime()
{
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds%60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
}

function pad(val)
{
    var valString = val + "";
    if(valString.length < 2)
    {
        return "0" + valString;
    }
    else
    {
        return valString;
    }
}

//counter for the number of differences the user spotted
var counter = 0;


window.onload = function() {
    //highlighting to the user that this is a practice round
    alert('Please note that this is a practice round.');
    //once the user clicks on start, we set the game up
    setGame();
}



function setGame() {

    //adding event listeners to all the image maps of the differences in the image so that they'll be highlighted and registered upon click

    document.getElementById("one").addEventListener("click", selectArea);
    document.getElementById("two").addEventListener("click", selectArea);
    document.getElementById("three").addEventListener("click", selectArea);
    document.getElementById("four").addEventListener("click", selectArea);
    document.getElementById("five").addEventListener("click", selectArea);
    document.getElementById("six").addEventListener("click", selectArea);
    document.getElementById("seven").addEventListener("click", selectArea);
    document.getElementById("eight").addEventListener("click", selectArea);
    document.getElementById("nine").addEventListener("click", selectArea);
    document.getElementById("ten").addEventListener("click", selectArea);

    document.getElementById("first").addEventListener("click", selectArea);
    document.getElementById("second").addEventListener("click", selectArea);
    document.getElementById("third").addEventListener("click", selectArea);
    document.getElementById("fourth").addEventListener("click", selectArea);
    document.getElementById("fifth").addEventListener("click", selectArea);
    document.getElementById("sixth").addEventListener("click", selectArea);
    document.getElementById("seventh").addEventListener("click", selectArea);
    document.getElementById("eighth").addEventListener("click", selectArea);
    document.getElementById("ninth").addEventListener("click", selectArea);
    document.getElementById("tenth").addEventListener("click", selectArea);
}

function selectArea(event) {
    //updating the counter for the number of differences the user spotted
    counter++;
    document.getElementById("counter").innerText=counter;

    //removing the event listener from the clicked area, so that the difference cannot be counted more than once
    this.removeEventListener('click', selectArea);

    //highlighting the clicked area
    //relevant credits: TODO
    var selected = document.createElement('div');
    selected.className = 'selected';
    selected.style.left = event.pageX + 'px';
    selected.style.top = event.pageY + 'px';
    selected.innerHTML="&#10003;";
    document.getElementById("wrap").appendChild(selected);

    //when the user finds all the differences in the practice session
    if(counter>=10){
        //update the practice time in the database
        updatePracticeTime(minutesLabel.innerHTML, secondsLabel.innerHTML);

        //display the card with the continue link
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlay-card").style.display = "block";
    }
}

//activating the image map resizing library
imageMapResize();