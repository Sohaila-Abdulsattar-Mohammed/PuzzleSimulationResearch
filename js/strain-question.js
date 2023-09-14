import { updateGeneralStrain} from "./user.js";

//getting the data object
var data = JSON.parse(sessionStorage.getItem('user_data'));


window.onload = function() {
    //listening for a click on submit
    document.getElementById("submit").addEventListener("click", submitLevel);
}


function submitLevel(){
    //updating the general strain level in the database, as indicated by the user
    updateGeneralStrain(document.getElementById("general_strain").value);
    //if there have indeed been pop-ups
    if(data['popup_type']!='none'){
        //redirect to the popup remembrance question page
        window.location.href = "197482838.html";
    }
    else{
        //redirect to the thank you page
        window.location.href = "780764425.html";
    }
} 
