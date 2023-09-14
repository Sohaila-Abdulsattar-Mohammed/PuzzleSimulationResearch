import { updateTime, updateIdleTime, updateMistakes, updatePopupType, updatePopupsShown } from "./user.js";

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


//relevant credits for sudoku: https://www.youtube.com/watch?v=S4uRtTb8U-U&ab_channel=KennyYipCoding

//the number selected by the user
var numSelected = null;
//the tile in which the number selected is to be inserted
var tileSelected = null;
//tracks the selection of the erase button
var eraseSelected = null;
//counter of number of mistakes the user makes
var mistakes = 0;

//the values the board will be initially populated with
var board = [
    "--356-47-",
    "---342--1",
    "-2-197---",
    "43---681-",
    "2-68---9-",
    "9----3-6-",
    "---6-5123",
    "-58--97--",
    "--2-345--"
];

//the solution for the sudoku board
var solution = [
    "193568472",
    "867342951",
    "524197638",
    "435926817",
    "276851394",
    "981473265",
    "749685123",
    "358219746",
    "612734589"
];

//idle time counters
var idleTime = 0;
var total_idleTime = 0;

window.onload = function() {
    //once the user clicks on start, we set the game up
    document.getElementById('start').addEventListener('click', function () {
        document.getElementById('overlay2').style.display = 'none';
        setGame();
    })
}


function setGame() {

    //start recording the time
    setInterval(setTime, 1000);

    //calling the randomizer function to possibly add pop-ups
    randomizer();

    //populating the list of numbers to choose from (1-9)
    for(let i=1;i<=9;i++) {
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    //listening for clicks on erase and submit buttons
    document.getElementById("erase").addEventListener("click", selectErase);
    document.getElementById("submit1").addEventListener("click", checkDone);

    //populating the sudoku board with the initial values
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

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

//function to select a number to insert in the sudoku board
function selectNumber(){
    //if there was a number previously selected, clear its selection
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    //if erase was selected, clear its selection
    if (eraseSelected){
        eraseSelected.classList.remove("erase-selected");
        eraseSelected = null;
    }
    //the number selected is now what has been clicked
    numSelected = this;
    numSelected.classList.add("number-selected");
}

//function to select a tile in which to insert the selected number
function selectTile() {
    //if a valid tile was clicked with the erase selected, we clear what was in the clicked tile
    if (eraseSelected && this.innerText != "" && !this.classList.contains("tile-start")){
        this.innerText = "";
        //this counts as a mistake, so we increment the mistake counter
        mistakes++;
    }
    //else if a tile was clicked with a number selected
    else if (numSelected) {
        //if an invalid tile was clicked (an already filled tile), then we do nothing
        if (this.innerText != ""){
            return;
        }
        //otherwise, we insert the selected number into the tile
        tileSelected = this;
        this.innerText = numSelected.id;
        
    }  
}

//a function to select the erase button
function selectErase() {
    //registering the erase and highlighting it
    eraseSelected = this;
    eraseSelected.classList.add("erase-selected");
    //resetting the selected number to nothing
    if(numSelected){
        numSelected.classList.remove("number-selected");
        numSelected = null;
    }
}

//a function to check the user's submission
function checkDone() {

    //getting all the tiles
    let tiles = document.getElementsByClassName("tile");
    //won is initially null
    let won = null;

    //looping through each of the tiles to compare their values to the solution
    Array.from(tiles).forEach(function (tile) {
        let row = tile.id[0];
        let col = tile.id[2];

        //if one tile doesn't match the solution, won is set to false
        if (tile.innerText != solution[row][col]) {
            won = false;
        }
    });

    //if won is false, then the submission is incorrect, so we prompt the user to try again
    if(won==false){
        //this counts as a mistake, so we increment the mistake counter
        mistakes++;
        alert('Your submission is incorrect/incomplete, please revise your solution and try again.');
    }
    //otherwise the submission is correct
    else {
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

    var random_number = Math.floor(Math.random() * (4 - 1 + 1)) + 1; //relevant credits: //https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range

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