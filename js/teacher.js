class Teacher {
    constructor(name, startTime, endTime, meetingList) {
        this.name = name;
        this.cellList = new Map();
        this.startTime = startTime;
        this.endTime = endTime;
        this.meetingList = meetingList;
        this.registeredStudents = new Map();
        this.writeToTeacherList();
        this.createCelles();
        this.initCellsFromDB();
    }

    writeToTeacherList() {
        document.getElementById("teacher").innerHTML += "<th>" + this.name + "</th>";
    }

    createCelles() {
        for (let hour = this.startTime; hour < this.endTime; hour++) {
            this.cellList.set(hour + "00", new Cell(this.name, hour + "00"));
            this.cellList.set(hour + "20", new Cell(this.name, hour + "20"));
            this.cellList.set(hour + "40", new Cell(this.name, hour + "40"));
        }

    }
    getName() {
        return this.name;
    }

    updateCell(student, time, color) {
        let cell = this.cellList.get(time);
        if (this.registeredStudents.has(student)) {
            return false;
        }
        this.registeredStudents.set(student, time);

        return cell.markCell(color);
    }

    initCellsFromDB() {
        for (var key in this.meetingList) {
            let cell = this.cellList.get(this.meetingList[key].time);
            this.registeredStudents.set(this.meetingList[key].name, this.meetingList[key].time);
            cell.update(this.meetingList[key].name);

        }
    }

    checkingIfAnotherHourMark(user) {
        return this.registeredStudents.has(user);
    }

    userChangeHour(user) {
        if (this.registeredStudents.has(user)) {
            let time = this.registeredStudents.get(user);
            this.registeredStudents.delete(user);
            this.cellList.get(time).changeCellColor("white");
            return;
        }
    }

    isCellMarked(id){
        return this.cellList.get(id).isMark();
    }

    cellCanChange(id){
        return this.cellList.get(id).isCanChange();
    }

}

/********************************************************************************************************** */
