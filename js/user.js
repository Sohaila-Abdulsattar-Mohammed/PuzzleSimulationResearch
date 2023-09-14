//importing the firebase functions from the SDKs needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, push} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

//the web app's firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHRWALL58w2GKHj0kdUi_Ex6fukgOEXYM",
    authDomain: "puzzle-simulation-database.firebaseapp.com",
    databaseURL: "https://puzzle-simulation-database-default-rtdb.firebaseio.com",
    projectId: "puzzle-simulation-database",
    storageBucket: "puzzle-simulation-database.appspot.com",
    messagingSenderId: "862774535736",
    appId: "1:862774535736:web:51ad4f32b4533bba2d68cd"
};

//initializing Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const usersinDB = ref(database, "users");

//initializing some variables to use later
var user_data;
var data;


window.onload = function() {   

    //listening for the submit button
    let submit = document.getElementById("submit");
    submit.addEventListener("click", getData);

    //populating the age dropdown list
    for(let i=18;i<=99;i++) {
        let number = document.createElement("option");
        number.value = i
        number.innerText = i;
        document.getElementById("age").appendChild(number);
    }

    //the max value in some dropdown lists
    let max = document.createElement("option");
    max.value = '60+';
    max.innerText = '60+';

    //populating the paid employment dropdown list
    for(let i=1;i<=59;i++) {
        let number = document.createElement("option");
        number.value = i
        number.innerText = i;
        document.getElementById("paid-employment").appendChild(number);
    }
    document.getElementById("paid-employment").appendChild(max);

    //populating the childcare dropdown list
    for(let i=0;i<=59;i++) {
        let number = document.createElement("option");
        number.value = i;
        number.innerText = i;
        document.getElementById("childcare").appendChild(number);
    }
    document.getElementById("childcare").appendChild(max);

    //populating the housework dropdown list
    for(let i=0;i<=59;i++) {
        let number = document.createElement("option");
        number.value = i;
        number.innerText = i;
        document.getElementById("housework").appendChild(number);
    }
    document.getElementById("housework").appendChild(max);

}


function getData() {
    
    //getting the kind of device the user is on
    //relevant credits: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    let isPhone = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isPhone = true;})(navigator.userAgent||navigator.vendor||window.opera);

    //'mobile device' includes phones and tablets, 'computer' includes laptops and desktops
    let device = isPhone ? 'mobile device' : 'computer';   


    //getting the user's submitted data
    let age = document.querySelector('#age').value;
    let gender = document.querySelector('#gender').value;
    let education = document.querySelector('#education-level').value;
    let country = document.querySelector('#country').value;
    let marital_status = document.querySelector('#marital-status').value;
    let children = document.querySelector('#children').value;
    let paid_employment = document.querySelector('#paid-employment').value;
    let childcare = document.querySelector('#childcare').value;
    let housework = document.querySelector('#housework').value;
    
    //storing the data in an object
    user_data = {
        device : device,
        age : age,
        gender : gender,
        education_level : education,
        country : country,
        marital_status : marital_status,
        children : children,
        paid_employment_weekly_hours : paid_employment,
        childcare_weekly_hours : childcare,
        housework_weekly_hours : housework,
        choice : 'not recorded',
        practice_time: 'not recorded',
        popup_type: 'not recorded',
        popups_shown:'not recorded',
        popups_list: [],
        time : 'not recorded',
        idle_time: 'not recorded',
        mistakes : 'not recorded',
        general_strain: 'not recorded',
        recalled_popups: 'not recorded'
    };

    //saving the user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(user_data));
    
}

//below are functions that can be called on outside this file, ie exportable

//updates the user's choice of task
export function updateChoice(choice){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'));
    //updating the user's task choice
    data['choice'] = choice;
    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the user's practice time
export function updatePracticeTime(minutes, seconds){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'))
    //updating the user's practice time
    data['practice_time'] = minutes + ':' + seconds;
    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the user's official time
export function updateTime(minutes, seconds){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'));
    //updating the user's official time
    data['time'] = minutes + ':' + seconds;
    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the user's idle time
export function updateIdleTime(seconds){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'));
    //updating the user's idle time
    data['idle_time'] = seconds;
    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the number of mistakes the user made while completing the task
export function updateMistakes(mistakes){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'));
    //updating the user's number of mistakes
    data['mistakes'] = mistakes;
    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the pop-up type shown to the user
export function updatePopupType(type){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'));
    //updating the pop-up type, based on what has been saved in the local storage
    data['popup_type'] = type;
    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the pop-up list shown to the user
export function updatePopupList(list){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'));
    //updating the pop-up list
    data['popups_list'] = list.join('\n\n');
    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the number of pop-ups that have been shown to the user
export function updatePopupsShown(number){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'))
    //if no pop-ups have actually been shown to the user, we also set the 'recalled_popups' to 'NA'
    if(number == 'NA'){
        data['recalled_popups'] = 'NA';
    }
    //updating the number of pop-ups shown, based on what has been saved in the local storage
    data['popups_shown'] = number;
    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the strain level the user chose
export function updateGeneralStrain(number){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'));
    //updating the user's chosen strain level
    data['general_strain'] = number;
    
    /*if no pop-ups have been shown to the user then this was the last thing we needed
    to save from the user, and we can finally push all the data to the database*/
    if(data['popup_type']=='none'){
        data['popup_strain'] = 'NA';
        push(usersinDB, data);
    }

    //saving the updated user_data object in the session storage as a JSON string 
    sessionStorage.setItem('user_data', JSON.stringify(data));
}

//updates the pop-ups the user recalled
export function updateRecalledPopups(response){
    //parsing the stringified user_data object back into a data object
    data = JSON.parse(sessionStorage.getItem('user_data'));
    //updating the user's recalled pop-ups
    data['recalled_popups'] = response;
    //finally pushing all the data to the database
    push(usersinDB, data);
}