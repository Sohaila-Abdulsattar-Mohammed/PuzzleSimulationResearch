import { updateRecalledPopups } from "./user.js";

//getting the data object
var data = JSON.parse(sessionStorage.getItem('user_data'));

window.onload = function() {
    //listening for the click on submit
    document.getElementById("submit").addEventListener("click", submit);
}

function submit(){
    //if the user has not filled a response, we ask them to do so before submiting
    if(document.getElementById('response').value==""){
        alert('Please respond to the question below before submitting.');
    }
    else{
        //updating the user's response in the database
        updateRecalledPopups(document.getElementById('response').value);
        //showing the user the pop-up messages that were shown during the game
        document.getElementById("popups").innerText = data["popups_list"];
        document.getElementById("overlay").style.display = "block";
    }
}