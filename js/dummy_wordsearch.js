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


//counter to track the number of finished words
var completedWords = 0;

//the values the grid will be initially populated with
var board = [
    "LICONBHDKJ",
"ALNOYMALSR",
"ZTIXLLSCTB",
"UWZKALOBAS",
"GIZSSOEKTV",
"TREBKMUGEG",
"RJIIJLMXEI",
"ASENMNJYQE",
"EFAMILYGBE",
"NOINIPODUN"
]

//the list of words to be found in the grid
var words = [
    "skill",
"art",
"salad",
"family",
"college",
"state",
"cookie",
"opinion"
]

//keeps track to the letters selected
var selectedTiles = [];
//keeps track of the orientation of the selection
var path = null;
//id of the initial letter selected
var pivotID;
//id of the other letter selected
var otherID;


window.onload = function() {
    //highlighting to the user that this is a practice round
    alert('Please note that this is a practice round.');
    //setting up the game
    setGame();
}


function setGame() {

    //populating the list of words to be found
    for(let i=0;i<8;i++) {
        let number = document.createElement("li");
        number.id = words[i];
        number.innerText = words[i];
        number.classList.add("number");
        document.getElementById("word").appendChild(number);
    }

    //populating the word search grid with the initial letters
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.innerText = board[r][c];
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }


    //select by dragging method
    //relevant credits: https://stackoverflow.com/questions/2013902/select-cells-on-a-table-by-dragging
    var isMouseDown = false;
    $(".tile")
    .mousedown(function () {
        isMouseDown = true;
        //recording the initial letter id
        pivotID = this.id.split('-');
        //adding the first letter to the selected tiles list
        selectedTiles.push(this);
        //highlighting the selected letter
        $(this).addClass("number-selected");
        return false; // prevent text selection
    })
    .mouseover(function () {
        if (isMouseDown) {
            //recording the initial letter id
            otherID = this.id.split('-');

            //depending on the location of the pivot id and other id with respect to each other, we determine the orientation of the selection:
            
            //diagonal selection
            if ((pivotID[0]-otherID[0] == pivotID[1]-otherID[1]) || (pivotID[0]-otherID[0] == -(pivotID[1]-otherID[1]))){
                
                //if the path has already been recorded previously as vertical or horizontal, then that means the orientation is changing upon selection
                if(path=='hor'||path=='ver'){
                    //reset the selected tiles
                    clearSelectedTiles();
                
                    //diagonal to bottom right
                    if(otherID[0]>pivotID[0] && otherID[1]>pivotID[1]){
                        selectDiagonalBottomRight();
                    }

                    //diagonal to bottom left
                    else if(otherID[0]>pivotID[0] && otherID[1]<pivotID[1]){
                        selectDiagonalBottomLeft();
                    }

                    //diagonal top right
                    else if(otherID[0]<pivotID[0] && otherID[1]>pivotID[1]){
                        selectDiagonalTopRight();
                    }

                    //diagonal top left
                    else if(otherID[0]<pivotID[0] && otherID[1]<pivotID[1]){
                        selectDiagonalTopLeft();
                    }

                    //record the path as diagonal
                    path = 'diagonal';
                }
                //otherwise, we can directly add the letters to the selected tiles, highlight them, and record the path as diagonal
                else{
                    selectedTiles.push(this);
                    $(this).addClass("number-selected");
                    path = 'diagonal';
                }
            }

            //horizontal selection
            else if (pivotID[0] == otherID[0]){
                //if the path has already been recorded previously as diagonal or vertical, then that means the orientation is changing upon selection
                if(path=='diagonal'||path=='ver'){
                    //reset the selected tiles
                    clearSelectedTiles();

                    //horizontal to the left
                    if(otherID[1]<pivotID[1]){
                        selectHorizontalToLeft();
                    }
                    //horizontal to the right
                    else{
                        selectHorizontalToRight();
                    }
                    //record the path as horizontal
                    path = 'hor';
                }
                //otherwise, we can directly add the letters to the selected tiles, highlight them, and record the path as horizontal
                else{
                    selectedTiles.push(this);
                    $(this).addClass("number-selected");
                    path = 'hor';
                }  
            }

            //vertical selection
            else if(pivotID[1] == otherID[1]){
                //if the path has already been recorded previously as diagonal or horizontal, then that means the orientation is changing upon selection
                if(path=='diagonal'||path=='hor'){
                    //reset the selected tiles
                    clearSelectedTiles();

                    //vertical to the top
                    if(otherID[0]<pivotID[0]){
                        selectVerticalToTop();
                    }
                    //vertical to the bottom
                    else{
                        selectVerticalToBottom();
                    }
                    //record the path as vertical
                    path = 'ver';
                }
                //otherwise, we can directly add the letters to the selected tiles, highlight them, and record the path as vertical
                else{
                    selectedTiles.push(this);
                    $(this).addClass("number-selected");
                    path = 'ver';
                }  
            } 
        }
    });


    //touch to select method (for touch screens)
    $(".tile").on('touchstart', function () {
        isMouseDown = true;
        //adding the letter to the selected tiles list
        selectedTiles.push(this);
        //highlighting the selected letter
        $(this).addClass("number-selected");
        return false; // prevent text selection
    });


    //when the mouse is released (or a touch outside the grid)
    $(document).mouseup(function () {
        isMouseDown = false;
        //check the selected letters
        checkWord(selectedTiles);
        //reset the selected tiles list
        selectedTiles.length=0;
        //reset the path
        path = null;
    }); 

    
}

//clears the selected tiles
function clearSelectedTiles(){
    //removes the highlight from each letter
    selectedTiles.forEach((item)=>{
        item.classList.remove("number-selected");
    });
    //resets the selected tiles list
    selectedTiles.length=0;
}

//selects every letter between the first and last letters in a bottom right diagonal orientation
function selectDiagonalBottomRight(){
    for(var i = 0;i<=otherID[0]-pivotID[0];i++){
        var row = parseInt(pivotID[0])+i;
        var col = parseInt(pivotID[1])+i;
        document.getElementById(`${row}-${col}`).classList.add("number-selected");
        selectedTiles.push(document.getElementById(`${row}-${col}`));
    }
}

//selects every letter between the first and last letters in a bottom left diagonal orientation
function selectDiagonalBottomLeft(){
    for(var i = 0;i<=otherID[0]-pivotID[0];i++){
        var row = parseInt(pivotID[0])+i;
        var col = parseInt(pivotID[1])-i;
        document.getElementById(`${row}-${col}`).classList.add("number-selected");
        selectedTiles.push(document.getElementById(`${row}-${col}`));
    }
}

//selects every letter between the first and last letters in a top right diagonal orientation
function selectDiagonalTopRight(){
    for(var i = 0;i<=pivotID[0]-otherID[0];i++){
        var row = parseInt(pivotID[0])-i;
        var col = parseInt(pivotID[1])+i;
        document.getElementById(`${row}-${col}`).classList.add("number-selected");
        selectedTiles.push(document.getElementById(`${row}-${col}`));
    }
}

//selects every letter between the first and last letters in a top left diagonal orientation
function selectDiagonalTopLeft(){
    for(var i = 0;i<=pivotID[0]-otherID[0];i++){
        var row = parseInt(pivotID[0])-i;
        var col = parseInt(pivotID[1])-i;
        document.getElementById(`${row}-${col}`).classList.add("number-selected");
        selectedTiles.push(document.getElementById(`${row}-${col}`));
    }
}

//selects every letter between the first and last letters in a right horizontal orientation
function selectHorizontalToRight(){
    for(var i = pivotID[1];i<=otherID[1];i++){
        document.getElementById(`${pivotID[0]}-${i}`).classList.add("number-selected");
        selectedTiles.push(document.getElementById(`${pivotID[0]}-${i}`));
    }
}

//selects every letter between the first and last letters in a left horizontal orientation
function selectHorizontalToLeft(){
    for(var i = otherID[1];i<=pivotID[1];i++){
        document.getElementById(`${pivotID[0]}-${i}`).classList.add("number-selected");
        selectedTiles.push(document.getElementById(`${pivotID[0]}-${i}`));
    }
}

//selects every letter between the first and last letters in a bottom vertical orientation
function selectVerticalToBottom(){
    for(var i = pivotID[0];i<=otherID[0];i++){
        document.getElementById(`${i}-${pivotID[1]}`).classList.add("number-selected");
        selectedTiles.push(document.getElementById(`${i}-${pivotID[1]}`));
    }
}

//selects every letter between the first and last letters in a top vertical orientation
function selectVerticalToTop(){
    for(var i = otherID[0];i<=pivotID[0];i++){
        document.getElementById(`${i}-${pivotID[1]}`).classList.add("number-selected");
        selectedTiles.push(document.getElementById(`${i}-${pivotID[1]}`));
    }
}

//checks the correctness of the selected letters
function checkWord(tiles){
    //list to keep track of the letters
    var letters=[];
    //taking the letter from each selected tile and pushing it into the letters list
    tiles.forEach((tile) => {
        letters.push(tile.innerText);
    });
    //joining the letters in the list into a word
    var word = letters.join("").toLowerCase();
    //if the selected word is part of the list of words
    if (words.includes(word)){
        //confirm the highlight of the selected tiles
        tiles.forEach((tile) => {
            tile.classList.add("highlighted");
        });
        //crossing off the word from the list
        document.getElementById(word).classList.add("word-selected");
        //incrementing the counter finished words
        completedWords++;
        //if the eight words are selected, the game is won
        if(completedWords==8){
            gameWon();
        }
    }
    //if the selected word is not part of the list of words (so an incorrect selection)
    else {
        //remove the highlight from the selected tiles
        tiles.forEach((tile) => {
            tile.classList.remove("number-selected");
        });
    }
}


function gameWon(){
    //update the practice time in the database
    updatePracticeTime(minutesLabel.innerHTML, secondsLabel.innerHTML);
    
    //display the card with the continue link
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlay-card").style.display = "block";
}