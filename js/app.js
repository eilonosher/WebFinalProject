var teacherMap = new Map();
var startTime;
var endTime;
var user;
var students;
var teachers;
var userId;
$(document).ready(function () {
    console.log("ready!");
    user = localStorage.getItem('userName');
    initDataBase();


});

function hideLoading() {
    var x = document.getElementById("loading");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
function writeTheHourToHtmlPage() {
    for (let hour = this.startTime; hour < this.endTime; hour++) {
        document.getElementById("table").innerHTML += "<tr id='" + hour + "00'" + "></th>";
        document.getElementById("table").innerHTML += "<tr id='" + hour + "20'" + "></th>";
        document.getElementById("table").innerHTML += "<tr id='" + hour + "40'" + "></th>";
    }


}
function addTheHoursCol() {
    document.getElementById("teacher").innerHTML += "<th></th>";
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
    if(!teacher.cellCanChange(selectedTime)) return;
    if(teacher.isCellMarked(selectedTime)){
        if (confirm("לבטל את הפגישה?")) {
            teacher.userChangeHour(user,selectedTime);
            deleteFromDB(selectedName,user,teacher,selectedTime);
            return;
        } else 
            return;
    }
   let checkingIfAnotherHourMark =  teacher.checkingIfAnotherHourMark(user);
    if(checkingIfAnotherHourMark){
        teacher.userChangeHour(user,selectedTime);
        deleteFromDB(selectedName,user,teacher,selectedTime);
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
}

function deleteFromDB(selectedName,user,teacher,selectedTime){
    firebase.database().ref('/teacher/' + selectedName + '/list').once('value').then(function (snapshot) {
        let keys = [];
        snapshot.forEach(function (item) {
            if(item.val().name === user)
                deleteNode(item.key,selectedName,user);
            keys.push(item.key);
        });
        updateDataBase(selectedName,selectedTime)     

    });
}
function deleteNode(key,selectedName,user){
    firebase.database().ref('/teacher/' + selectedName + '/list/' + key).remove();
    
}
function initEvnet() {
    $('#table tr td').click(function () {
        console.log(this)
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