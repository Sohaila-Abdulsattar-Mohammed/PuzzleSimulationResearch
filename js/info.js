//getting the needed elements
var age = document.getElementById("age");
var consent = document.getElementById("consent");
var cont = document.getElementById("continue");

window.onload = function() {
    //validating when the user clicks on continue
    cont.addEventListener('click', validate);
}

function validate() {
    //if both checkboxed are checked, the user continues to their information page
    if (age.checked && consent.checked){
        window.location.href = "781268128.html";
    }
    //else, they're redirected to a thank you page
    else{
        window.location.href = "565303245.html";
    }
}
