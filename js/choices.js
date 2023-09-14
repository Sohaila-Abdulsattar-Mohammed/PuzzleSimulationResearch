import { updateChoice } from "./user.js";

window.onload = function() {
    //updating the user's choice based on the task chosen
    
    var sudoku = document.getElementById("sudoku");
    sudoku.addEventListener("click", function (){
        updateChoice("sudoku");
    });
    var word_search = document.getElementById("word-search");
    word_search.addEventListener("click", function (){
        updateChoice("word-search");
    });
    var spot_diff = document.getElementById("spot-diff");
    spot_diff.addEventListener("click", function (){
        updateChoice("spot-the-differences");
    });  
}