
var studentList;
var teacherList;
var startTime;
var endTime;
$(document).ready(function () {
    initDataBase();
    click_login();
});

function click_login(){

    $('#loginButton').click(function () {
        let validStudentName = validateStudent();
        if( validStudentName === true){
            window.location.href = "schedule.html";
            let user = document.getElementById("studentName").value;
            localStorage.setItem('userName', user);
            localStorage.setItem('start', startTime);
            localStorage.setItem('end', endTime);
            return false;

        }
        let validTeacherName = validateTeacher();
        if( validTeacherName === true){
            window.location.href = "teacher.html";
            let user = document.getElementById("studentName").value;
            localStorage.setItem('userName', user);
            return false;

        }
        if(!validTeacherName)
        showValidate();
        return false;
    })

}

$('.validate-form .input100').each(function(){
    $(this).focus(function(){
       hideValidate(this);
    });
});



function showValidate() {
    var thisAlert = $(".input100").parent();
    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass('alert-validate');
}




function validateStudent() {
    let input = document.getElementById("studentName").value;
    console.log(input);
    var check = false;
    for (let i = 0; i < studentList.length; i++) {
        if (studentList[i].name == input)
            check = true;

    }
   
    return check;

}

function validateTeacher() {
    let input = document.getElementById("studentName").value;
    console.log(input);
    var check = false;
    for (var key in teacherList) {
        if (teacherList[key].name === input)
            check = true;
    }
  
    
    return check;

}
function initDataBase() {
    var firebaseConfig = {
        apiKey: "AIzaSyAisF9DxbrZJv2yB0TkLjFTephoNWlY9-U",
        authDomain: "scheduleproject-f7ca1.firebaseapp.com",
        databaseURL: "https://scheduleproject-f7ca1.firebaseio.com",
        projectId: "scheduleproject-f7ca1",
        storageBucket: "scheduleproject-f7ca1.appspot.com",
        messagingSenderId: "886389423020",
        appId: "1:886389423020:web:1510d86fa70d38cfe5d809",
        measurementId: "G-40Z048RQ98"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Firebase
    firebase.database().ref('/student/').once('value').then(function (snapshot) {
        studentList = snapshot.val();
    });
    firebase.database().ref('/teacher/').once('value').then(function (snapshot) {
        teacherList = snapshot.val();
    });
    firebase.database().ref('/hour/').once('value').then(function (snapshot) {
        startTime = snapshot.val().start;
        endTime = snapshot.val().end;
    });
    


}