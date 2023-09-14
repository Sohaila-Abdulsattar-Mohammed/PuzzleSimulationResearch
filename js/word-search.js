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


//counter to track the number of finished words
var completedWords = 0;

//counter of number of mistakes the user makes
var mistakes = 0;

//the values the grid will be initially populated with
var board = [
    "YREVOCSIDP",
    "LJFFPWUXAY",
    "MCKOFSFTST",
    "LBLRDCESEI",
    "VKOEDNAGDN",
    "FNZSTRALAU",
    "FYATGQGJEM",
    "SCISYHPCRM",
    "KRFACADEHO",
    "CABISOEITC"
]
 
//the list of words to be found in the grid
var words = [
    "community",
    "discovery",
    "facade",
    "forest",
    "grass",
    "patent",
    "physics",
    "thread"
]

//keeps track to the letters selected
var selectedTiles = [];
//keeps track of the orientation of the selection
var path = null;
//id of the initial letter selected
var pivotID;
//id of the other letter selected
var otherID;

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
        //increment the mistake counter
        mistakes++;
    }
}


function gameWon(){
    
    //update the time, idle time, and number of mistakes in the database
    updateTime(minutesLabel.innerHTML, secondsLabel.innerHTML);
    updateMistakes(mistakes);
    updateIdleTime(total_idleTime);

    //display the card with the continue link
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlay-card").style.display = "block";
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