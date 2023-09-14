import {updateTime, updateIdleTime, updateMistakes, updatePopupType, updatePopupsShown } from "./user.js";

//code for the timer at the top-left of the page
//relevant credits: https://codepen.io/reynnor/pen/vmNaeM 
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

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
//counter of number of mistakes the user makes
var mistakes = 0;
//list of the ids of all the image maps of the differences in the image
var differences_ids = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','one','two','three','four','five','six','seven','eight','nine','ten']


//idle time counters
var idleTime = 0;
var total_idleTime = 0;

window.onload = function() {
    //once the user clicks on start, we set the game up
    document.getElementById('start').addEventListener('click', function () {
        document.getElementById('overlay2').style.display = 'none';
        setGame();
    });
}



function setGame() {

    //start recording the time
    setInterval(setTime, 1000);

    //calling the randomizer function to possibly add pop-ups
    randomizer();

    //for the phone-oriented image, if the user clicks on an area that is not part of the solution, this will count as a mistake
    document.getElementsByClassName('phone')[0].addEventListener('click', function(e) {
        if(!differences_ids.includes(e.target.id)){
            mistakes++;
        }
    });

    //for the desktop-oriented image, if the user clicks on an area that is not part of the solution, this will count as a mistake
    document.getElementsByClassName('desktop')[0].addEventListener('click', function(e) {
        if(!differences_ids.includes(e.target.id)){
            mistakes++;
        }
    });


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

    //for idle time detection, resetting the idle time whenever the user uses the mouse/touches the screen
    //relevant credits: https://www.geeksforgeeks.org/how-to-detect-idle-time-in-javascript/
    let timer = 0;
        
    function resetTimer() {
        //clears the previous interval
        clearInterval(timer);
        
        //keeps track of total idle time
        total_idleTime+=idleTime;

        //reset the seconds of the timer
        idleTime = 0;
        
        //set a new interval
        timer = setInterval(startIdleTimer, 1000);
    }
        
    // Define the events that would reset the timer
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;
        
    function startIdleTimer() {    
        // Increment the timer seconds
        idleTime++;
    }
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

    //when the user finds all the differences in the actual session
    if(counter>=10){
        //update the time, idle time, and number of mistakes in the database
        updateTime(minutesLabel.innerHTML, secondsLabel.innerHTML);
        updateIdleTime(total_idleTime);
        updateMistakes(mistakes);
        //display the card with the continue link
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlay-card").style.display = "block";
    }
}


//function that randomly determines the type of pop-ups to be shown to the user
function randomizer(){

    var random_number = Math.floor(Math.random() * (4 - 1 + 1)) + 1; //relevant credits: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    
    //if the random number is 1, then no pop-ups will be shown
    if (random_number==1){
        //immediately updating the popup_type and popups_shown in the database accordingly
        updatePopupType("none");
        updatePopupsShown("NA");
    }
    //if the random number is 2, then the 'housework own mess' pop-ups will be shown
    else if(random_number==2){
        //adding the corresponding javascript file to the html
       $('body').append("<script src='js/housework-own-mess-popups.js' type='module'></script>");
       updatePopupType("housework own mess");
    }
    //if the random number is 3, then the 'housework others will see' pop-ups will be shown
    else if(random_number==3){
        //adding the corresponding javascript file to the html
        $('body').append("<script src='js/housework-others-will-see-popups.js' type='module'></script>");
        updatePopupType("housework others will see");
    }
    //if the random number is 4, then the 'work' pop-ups will be shown
    else if(random_number==4){
        //adding the corresponding javascript file to the html
        $('body').append("<script src='js/work-popups.js' type='module'></script>");
        updatePopupType("work");
    } 
}

//activating the image map resizing library
imageMapResize();
