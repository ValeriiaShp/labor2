var readonlyProperty = true;


$(document).ready(function () {
    $(function () {
        loadContent('professorNotifications')
    });


    $("#showMarks").click(function () {
        $.ajax({

                url: "/ois/semesters",

                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {
                loadContent("professorMarks");
                professorSemesters(data);
            });

    });

    $('#formGrade').submit(function() {
        $.ajax({
            data: $(this).serialize(),
            type: $(this).attr('method'),
            url: "/ois/putGrade/",
            success: function(data) {
                $("#changeGrade").modal('hide');
                professorMarks(data);
            }
        });
        return false;
    });


    $('#semesters').change(function () {
        document.getElementById("subjectsDiv").style.display = 'none';
        document.getElementById("homeworkDiv").style.display = 'none';


        $.ajax({
                url: "/ois/subjects/" + this.options[this.selectedIndex].value,
                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {
                loadContent("professorMarks");
                professorSubjects(data);
            });

    });

    $('#subjectSelect').change(function () {
        document.getElementById("homeworkDiv").style.display = 'none';
        $.ajax({
                url: "/ois/homeworks/" + this.options[this.selectedIndex].value,
                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {
                loadContent("professorMarks");
                professorHomeworks(data);
            });

    });

    $('#homeworkSelect').change(function () {
        $.ajax({
                url: "/ois/marks/" + this.options[this.selectedIndex].value,
                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {
                loadContent("professorMarks");
                professorMarks(data);
            });

    });


});

function professorSemesters(data) {
    $('#semesters')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select semester</option>')
        .val('null')
    ;
    var selectDropDown = document.getElementById("semesters");

    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var opt = document.createElement('option');
        opt.value = obj[i].semesterId;
        opt.innerHTML = obj[i].semester;
        selectDropDown.appendChild(opt);
    }
}

function professorSubjects(data) {
    document.getElementById("subjectsDiv").style.display = 'inline';

    $('#subjectSelect')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select subject</option>')
        .val('null')
    ;
    var selectDropDown = document.getElementById("subjectSelect");

    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var opt = document.createElement('option');
        opt.value = obj[i].selfId;
        opt.innerHTML = obj[i].name + " - " + obj[i].code;
        selectDropDown.appendChild(opt);
    }
}

function professorHomeworks(data) {
    document.getElementById("homeworkDiv").style.display = 'inline';

    $('#homeworkSelect')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select homework</option>')
        .val('null')
    ;
    var selectDropDown = document.getElementById("homeworkSelect");

    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var opt = document.createElement('option');
        opt.value = obj[i].selfId;
        opt.innerHTML = obj[i].name + " - " + obj[i].subjectCode;
        selectDropDown.appendChild(opt);
    }
}

function professorMarks(data) {
    $("#marksBody").empty();
    var table = document.getElementById("marksProf");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tableBody = table.getElementsByTagName('tbody')[0];
    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var row = tableBody.insertRow(0);
        row.className = "info";
        var studentName = row.insertCell(0);
        var subjectCode = row.insertCell(1);
        var homework = row.insertCell(2)
        var grade = row.insertCell(3);
        studentName.innerHTML = obj[i].userName;
        subjectCode.innerHTML = obj[i].homeWorkSubjectName + " - " + obj[i].homeWorkSubjectCode;
        homework.innerHTML = obj[i].homeWorkName;
        if (obj[i].mark != null) {
            grade.innerHTML = obj[i].mark;
        } else {

            grade.appendChild(createLink(obj[i].selfId));
        }
    }
}

function createLink(homework_id) {
    var a = document.createElement('a');
    var linkText = document.createTextNode("Not graded yet");
    a.appendChild(linkText);
    a.title = "Not graded yet";
    /* a.href = "/ois/editHomeworkUser/" + id;*/
    a.id = homework_id;
    a.class = "editHomeworkUser";
    a.onclick = function () {
        $.ajax({
                url: "/ois/editHomeworkUser/" + homework_id
            })
            .done(function (data) {
                loadContent("professorMarks");
                document.getElementById("hiddenInputId").textContent = homework_id;
                fillEditData(data, homework_id);
                $("#changeGrade").modal("show");
            });

    };
    document.body.appendChild(a);
    return a;
}

function fillEditData(data, hwId) {
    var obj = JSON.parse(data);
    var homeworkName = obj[0].homeworkName;
    var homeworkDescription = obj[0].homeworkDescription;
    var studentName = obj[0].userName;
    var studentAnswer = obj[0].answer;
    document.getElementById("hiddenInputId").value = hwId;
    document.getElementById("hiddenInputHomeworkId").value = obj[0].homeworkId;
    document.getElementById("homeworkName").textContent = homeworkName;
    document.getElementById("homeworkDescription").textContent = homeworkDescription;
    document.getElementById("homeworkStudentName").textContent = studentName;
    document.getElementById("homeworkStudentAnswer").textContent = studentAnswer;

}


function showInputForm() {
    document.getElementById("addNewLine").style.visibility = 'visible';
    createSelectName();
    createSelectCode()


}

function createSelectCode() {
    var divCodeName = document.getElementById("subjectCode");
    divCodeName.removeChild(divCodeName.childNodes[0]);
    var selectListCode = document.createElement("select");
    selectListCode.id = "selectCodeName";
    selectListCode.className = "form-control";
    divCodeName.appendChild(selectListCode);
    for (var i = 0; i <= jsonSize; i++) {
        var obj = JSON.parse(studentsArray);
        var optionCode = document.createElement("option");
        optionCode.text = obj.students[i].subjectCode;
        optionCode.value = optionCode.text;
        selectListCode.add(optionCode);
    }
}

function createSelectName() {
    var divStudName = document.getElementById("studentName");
    divStudName.removeChild(divStudName.childNodes[0]);
    var selectList = document.createElement("select");
    selectList.id = "selectStudName";
    selectList.className = "form-control";
    divStudName.appendChild(selectList);
    for (var i = 0; i <= jsonSize; i++) {
        var obj = JSON.parse(studentsArray);
        var option = document.createElement("option");
        option.text = obj.students[i].name + " - " + obj.students[i].studentCode;
        option.value = option.text;
        selectList.add(option);
    }
}

function loadContent(content) {
    if (content === 'logout') {
        window.location = "../login.html";
    }
    //disable others
    document.getElementById('professorNotifications').style.display = 'none';
    document.getElementById('professorMarks').style.display = 'none';
    document.getElementById('profStatistics').style.display = 'none';
    document.getElementById('professorSearch').style.display = 'none';
    document.getElementById('professorHomework').style.display = 'none';

    document.getElementById('profNot').className = "";
    document.getElementById('profMarks').className = "";
    document.getElementById('profStat').className = "";
    document.getElementById('profSearch').className = "";
    document.getElementById('profHomework').className = "";

    //enable one
    document.getElementById(content).style.display = 'block';
    if (content === "professorNotifications") {
        document.getElementById("profNot").className = "active";
        professorNotifications();
    } else if (content === "professorMarks") {
        document.getElementById('profMarks').className = "active";
    } else if (content === "profStatistics") {
        document.getElementById('profStat').className = "active";
    } else if (content === "professorSearch") {
        document.getElementById('profSearch').className = "active";
    }else if (content === "profHomework") {
        document.getElementById('profHomework').className = "active";
        professorHomework();
    }

}

function professorHomework(){
    document.getElementById('professorHomework').style.display = 'block';
}

function professorNotifications() {

}

function professorStatistics() {

}

function detailedInfo() {
    var table = document.getElementById("detailedInfo");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tBody = table.getElementsByTagName('tbody')[0];
    var name = document.getElementById("sdName").value;
    var nameCode = name.split("-");
    name = nameCode[0].substring(0, nameCode[0].length - 1);
    var obj = JSON.parse(studentsArray);
    for (var i = 0; i <= jsonSize; i++) {
        if (name === obj.students[i].name) {
            var row = tBody.insertRow(0);
            row.className = "info";
            var studentName = row.insertCell(0);
            var studentCode = row.insertCell(1);
            var subjectCode = row.insertCell(2);
            var grade = row.insertCell(3);
            studentName.innerHTML = obj.students[i].name;
            subjectCode.innerHTML = obj.students[i].subjectCode;
            studentCode.innerHTML = obj.students[i].studentCode;
            grade.innerHTML = obj.students[i].grade;
        }
    }
    document.getElementById("detailedInfo").style.display = "block";
}

function modifyMark(id) {
    if (readonlyProperty == true) {
        document.getElementById(id).removeAttribute("readonly");
        readonlyProperty = false;
    } else {
        document.getElementById(id).readOnly = "true";
        readonlyProperty = true;
    }
}

function validate() {
    var studentName = document.getElementById("selectStudName").value;
    var nameCode = studentName.split("-");
    studentName = nameCode[0].substring(0, nameCode[0].length - 1);
    var studentCode = nameCode[1].substring(1, nameCode[1].length);
    var subjectCOde = document.getElementById("selectCodeName").value;
    var grade = document.getElementById("grade").value;

    if (grade > 5 || grade < 0) {
        document.getElementById("errorLabel").style.display = "block";
        return;
    }

    var obj = JSON.parse(studentsArray);
    for (var i = 0; i <= jsonSize; i++) {
        if (studentName === obj.students[i].name && subjectCOde === obj.students[i].subjectCode
            && studentCode === obj.students[i].studentCode) {
            document.getElementById("errorMark").style.display = "block";
            return;
        }
    }

    obj['students'].push({
        "name": studentName,
        "studentCode": studentCode,
        "email": null,
        "subjectCode": subjectCOde,
        "grade": grade
    });
    studentsArray = JSON.stringify(obj);
    jsonSize += 1;
    document.getElementById("studentName").value = "";
    document.getElementById("subjectCode").value = "";
    document.getElementById("grade").value = "";
    document.getElementById("errorLabel").style.display = "none";
    document.getElementById("errorMark").style.display = "none";

    professorMarks();

}

$(function () {
    $("#sdName").autocomplete({
        //source: data
    });
});

function validateForm() {
    document.getElementById("errorLabel").style.display = "none";
    var grade = document.getElementById("homeworkGrade").value;
    if (grade < 1 || grade > 5) {
        event.preventDefault();
        document.getElementById("homeworkGrade").value = "";
        document.getElementById("errorLabel").style.display = "block";
    }


}



