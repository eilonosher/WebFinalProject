var teacherMap = new Map();
var startTime;
var endTime;
var user;
var students;
var teachers;
var userId;
var ready = false;
$(document).ready(function () {
    console.log("ready!");
    user = localStorage.getItem('userName');
    document.getElementById("helloUser").innerHTML = "Hello " + user + "'s parents";
    initDataBase();

});

function hideLoading() {
    let loader = document.getElementById("loading");
    let allElements = document.getElementById("allElements");
    if (loader.style.display === "none") {
        loader.style.display = "block";
    } else {
        loader.style.display = "none";
    }
    allElements.style.display = "block";
    ready = true;

}
function writeTheHourToHtmlPage() {
    for (let hour = this.startTime; hour < this.endTime; hour++) {
        document.getElementById("table").innerHTML += "<tr id='" + hour + "00'" + "></th>";
        document.getElementById("table").innerHTML += "<tr id='" + hour + "20'" + "></th>";
        document.getElementById("table").innerHTML += "<tr id='" + hour + "40'" + "></th>";
    }


}
function addTheHoursCol() {
    document.getElementById("teacher").innerHTML += "<th>Time</th>";
    for (let hour = this.startTime; hour < this.endTime; hour++) {
        document.getElementById(hour + "00").innerHTML += "<td>" + hour + "00" + "</td>";
        document.getElementById(hour + "20").innerHTML += "<td>" + hour + "20" + "</td>";
        document.getElementById(hour + "40").innerHTML += "<td>" + hour + "40" + "</td>";
    }


}


function buildTable() {
    for (var key in teachers) {
        let teacherName = teachers[key].name;
        let teacherMeeting = teachers[key].list;

        teacherMap.set(teacherName, new Teacher(teacherName, startTime, endTime, teacherMeeting));
    }
}

function handleEvnet(id) {
    var selectedName = id.split("-")[0];
    var selectedTime = id.split("-")[1];    
    let teacher = teacherMap.get(selectedName);
    ready = false;
    if(teacher.isCellMarked(selectedTime) && teacher.cellCanChange(selectedTime)){
        if (confirm("Cancel the meeting?")) {
            teacher.userChangeHour(user,selectedTime);
            deleteFromDB(selectedName,user,teacher,selectedTime,true);
            return;
        } else 
        return;
    }
    if(!teacher.cellCanChange(selectedTime) || isAlreadyRegisteredThisTime(selectedTime)) return;
   let checkingIfAnotherHourMark =  teacher.checkingIfAnotherHourMark(user);
    if(checkingIfAnotherHourMark){
        teacher.userChangeHour(user,selectedTime);
        deleteFromDB(selectedName,user,teacher,selectedTime,false);
    }
    else{
        updateDataBase(selectedName,selectedTime)
    }
    teacher.updateCell(user,selectedTime,"green");
}

function updateDataBase(selectedName,selectedTime){
    var rootRef = firebase.database().ref();
    var storesRef = rootRef.child('/teacher/' + selectedName + '/list');
    var newStoreRef = storesRef.push();

    newStoreRef.set({
        time: selectedTime,
        name: user

    });
    ready = true;
}

function isAlreadyRegisteredThisTime(time){
    for (let [key, teacher] of teacherMap)  {
        let registeredTime = teacher.getStudentRegisteredTime(user);
        if(registeredTime != null && registeredTime == time){
            alert("You are already registered to another teacher by that time")
            return true;
        }
    }
    return false;
}
function deleteFromDB(selectedName,user,teacher,selectedTime,onlyDelete){
    firebase.database().ref('/teacher/' + selectedName + '/list').once('value').then(function (snapshot) {
        let keys = [];
        snapshot.forEach(function (item) {
            if(item.val().name === user)
                deleteNode(item.key,selectedName,user);
            keys.push(item.key);
        });
        if(!onlyDelete)
        updateDataBase(selectedName,selectedTime)     

    });
}
function deleteNode(key,selectedName,user){
    firebase.database().ref('/teacher/' + selectedName + '/list/' + key).remove();
    
}
function initEvnet() {
    $('#table tr td').click(function () {
        let mark = handleEvnet($(this).attr('id'));
    });
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
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userId = user;
        }
        
    });
    var ref = firebase.database().ref("teacher");
    firebase.database().ref().on('value', function(snapshot) {
        if(ready)
        location.reload();
    });
    firebase.database().ref('//').once('value').then(function (snapshot) {
        students = snapshot.val().student;
        startTime = snapshot.val().hour.start;
        endTime = snapshot.val().hour.end;
        teachers = snapshot.val().teacher;
        writeTheHourToHtmlPage();
        addTheHoursCol();
        buildTable();
        initEvnet();
        hideLoading();
    });


}