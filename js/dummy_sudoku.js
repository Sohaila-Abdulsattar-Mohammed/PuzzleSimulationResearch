import { updatePracticeTime } from "./user.js";

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


//relevant credits for sudoku: https://www.youtube.com/watch?v=S4uRtTb8U-U&ab_channel=KennyYipCoding


//the number selected by the user
var numSelected = null;
//the tile in which the number selected is to be inserted
var tileSelected = null;
//tracks the selection of the erase button
var eraseSelected = null;

//the values the board will be initially populated with
var board = [
    "---4-7--3",
"---915---",
"1--683--4",
"68--3---9",
"73--98-1-",
"---76--58",
"47-----81",
"851---27-",
"-268--43-"
];

//the solution for the sudoku board
var solution = [
    "396745128",
    "157832946",
    "284196573",
    "672984351",
    "831257469",
    "549613287",
    "415378692",
    "763429815",
    "928561734"
];

window.onload = function() {
    //highlighting to the user that this is a practice round
    alert('Please note that this is a practice round.');
    //setting up the game
    setGame();
}


function setGame() {
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
    //document.getElementById("submit").addEventListener("click", checkDone);

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
        alert('Your submission is incorrect/incomplete, please revise your solution and try again.');
    }
    //otherwise the submission is correct
    else {
        //update the practice time in the database
        updatePracticeTime(minutesLabel.innerHTML, secondsLabel.innerHTML);
        //display the card with the continue link
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlay-card").style.display = "block";
    }
}