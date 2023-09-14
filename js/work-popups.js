import {updatePopupsShown, updatePopupList } from "./user.js";


//counter for number of pop-ups shown
var number = 0;
//list of pop-up messages
var popups = ['Organise work to-do list - must be completed by tomorrow','Meeting Friday 12 noon with manager - prepare','Respond to work emails','Meeting with client 1-2pm Tuesday',"John can't work on Tuesday - organise a replacement",'Susie leaving work at 3pm on Monday - ensure work is done before hand','Promotion opportunity upcoming at work - prepare resume','Meeting with boss to discuss raise - prepare argument','Schedule appointment with team to discuss next project','Fill up work car with petrol - site visit 2 hour drive away','Pack umbrella for commute into work',"Prep for Ellie's preformance review 2pm Monday",'Set alarm for early start Thursday','Wrong product delivered - contact supplier','New client - set up preliminary consultation'];
//the list in which the randomly chosen pop-ups will be inserted
var popups_list=[];
//maximum number of pop-ups that can show up
var max = popups.length;
//getting random indices for the pop-ups that will be shown
//relevant credits: https://stackoverflow.com/questions/2380019/generate-unique-random-numbers-between-1-and-100
var arr = [];
while(arr.length < max){
    var r = Math.floor(Math.random() * ((max-1) - 0 + 1)) + 0;
    if(arr.indexOf(r) === -1) arr.push(r);
}

//if device is an apple device, we'll add the apple style to the popups
const user = navigator.userAgent.toLowerCase();
if(/iphone|ipad|ipod|macintosh|mac os x/.test(user)){
    document.getElementById("notification").classList.add('apple');
}

//getting the operating system the user is using
//relevant credits: https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
var userAgent = window.navigator.userAgent,
platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
iosPlatforms = ['iPhone', 'iPad', 'iPod'],
os = 'generic';

if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'mac';
} else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iphone';
} else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'windows';
}
  
//creating a sound object to play a notification sound with the pop-ups 
/*as per browser restrictions, the audio will only play if the user interacts with the page first.
refer to the following relevant credits to understand the workaround followed here: https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari*/
const sound = new Audio();
sound.autoplay = true;
window.addEventListener("click", () => {
    sound.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
}, { once: true });

//function that toggles the display of the pop-up messages
//relevant credits: https://stackoverflow.com/questions/63539655/div-visible-every-minute-for-10-seconds
function showHide() {

    var random_time = Math.floor(Math.random() * (40 - 30 + 1)) + 30; //relevant credits: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range

    setTimeout(() => {

        //if max number of pop-ups have been displayed then we can stop
        if (number==max || document.getElementById("overlay").style.display == "block"){
            document.getElementById("notification").style.display = "none";
            return;
        }

        //inserting the pop-up message
        document.getElementById("message").innerText = popups[arr[number]];
        //saving the pop-up that was shown
        popups_list.push(popups[arr[number]]);
        //updating the counter of pop-ups shown
        number++;
        //showing the pop-up message
        $("#notification").fadeToggle();
        //playing the notification sound based on the os
        sound.src = `audio/${os}-notification.mp3`;
        sound.play();


        setTimeout(() => {
            //hiding the pop-up message
            $("#notification").fadeToggle();           
            //starting all over by calling same function
            showHide();
        }, 3 * 1000);

    }, random_time * 1000);
}
  
//calling showHide once to start the pop-ups display
showHide();

//before leaving the page
window.onbeforeunload = function(){
    //updating in the database the number of pop-ups that were shown
    updatePopupsShown(number);
    //updating in the database the pop-ups list
    updatePopupList(popups_list);
};
