class Cell {
    constructor(teacher, time, user) {
        this.teacher = teacher;
        this.time = time;
        this.avilable = true;
        this.id = "id = " + '"' + teacher + "-" + time + '"';
        this.iconId = "id = " + '"' + teacher + "-" + time + 'icon"';
        this.writeToHtml();
        this.mark = false;
        this.canChange = true;
    }

    writeToHtml() {
        document.getElementById(this.time).innerHTML += "<td " + this.id + ";></td>";
    }

    update(student) {
        let change = false;
        let user = localStorage.getItem('userName');
        if (this.mark == false) {
            if (student === user){
                this.markCell("green");
            }
            else {
                this.canChange = false;
                document.getElementById(this.teacher + "-" + this.time).style.backgroundColor = "red";
            }
            change = true;
        }
        this.mark = true;
        return change;
    }

    markCell(color) {
        if (this.canChange == false)
            return;
        document.getElementById(this.teacher + "-" + this.time).style.backgroundColor = color;
        this.addOrRemoveIcon(color);
        this.mark = true;
        return this.mark;
    }

    changeCellColor(color) {
        if (this.canChange == false)
            return;
        document.getElementById(this.teacher + "-" + this.time).style.backgroundColor = color;
        this.addOrRemoveIcon(color);
    }

    addOrRemoveIcon(color){
        if (color === "white"){
            document.getElementById(this.teacher + "-" + this.time).innerHTML= "";
            this.mark = false;
        }
        else{
            document.getElementById(this.teacher + "-" + this.time).innerHTML= "<i "+this.iconId+" class='fa fa-trash'></i>";
            this.mark = true;
        }
    }

    isMark(){
        return this.mark;
    }

    isCanChange(){
        return this.canChange;
    }
}

/********************************************************************************************************** */
