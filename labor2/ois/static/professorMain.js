var fullJSON = [];

$(document).ready(function () {
    $(function () {
        loadContent('professorNotifications')
    });

    $("#profNotification").click(function () {
        $.ajax({

                url: "/ois/notifications",

                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {
                loadContent("professorNotifications");
                professorNotifications(data);
            });

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
                professorSemesters(data, "semesters");
            });

    });

    $("#profSearch").click(function () {
        loadContent("professorSearch");
    });

    $("#createHomework").click(function () {
        $.ajax({

                url: "/ois/semesters",

                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {
                loadContent("profHomework");
                professorSemesters(data, "semestersHomework");
            });

    });

    $('#formGrade').submit(function () {
        $.ajax({
            data: $(this).serialize(),
            type: "POST",
            url: "/ois/putGrade/",
            success: function (data) {
                $("#changeGrade").modal('hide');
                professorMarks(data);
            }
        });
        return false;
    });

    $('#creationForm').submit(function () {
        $.ajax({
            data: $(this).serialize(),
            type: "POST",
            url: "/ois/createHomework/",
            success: function (data) {
                document.getElementById("saved").style.display = 'block';
                clearForm();
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
                professorSubjects(data, "subjectSelect");
            });

    });

    $('#semestersHomework').change(function () {
        $.ajax({
                url: "/ois/subjects/" + this.options[this.selectedIndex].value
            })
            .done(function (data) {
                loadContent("profHomework");
                professorSubjects(data, "subjectSelectHome");
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

    $('#subjectSelectHome').change(function () {
        var i = this.options[this.selectedIndex].value;
        document.getElementById("subjectHWCreationId").value = this.options[this.selectedIndex].value;
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

    $('#sdName').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/ois/search',
                data: {
                    json_data: JSON.stringify({
                        enteredString: {
                            maxRows: 12,
                            nameStartsWith: request.term
                        }
                    })

                },
                success: function (data) {

                    response($.map(data, function (item) {
                        alert(data);
                        return {
                            plink: item.plink, // ссылка на страницу товара
                            label: item.title_ru // наименование товара
                        }
                    }));
                }
            });
        },
        select: function (event, ui) {
            // по выбору - перейти на страницу товара
            // Вы можете делать вывод результата на экран
            location.href = ui.item.plink;
            return false;
        },
        minLength: 1 // начинать поиск с трех символов
    });
});

var dataJson = [];
function makeJson(data) {
    fullJSON = data;
    var obj = JSON.parse(data);

    for (var i = 0; i < obj.length; i++) {
        var item = obj[i];
        dataJson.push(item.value);
    }
}

function loadContent(content) {
    $.ajax({

            url: "/ois/notifications",

            beforeSend: function (xhr) {
                //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
            }
        })
        .done(function (data) {
            countMessages(data);
        });

    if (content === 'logout') {
        window.location = "../login.html";
    }
    //disable others
    document.getElementById('professorNotifications').style.display = 'none';
    document.getElementById('professorMarks').style.display = 'none';
    document.getElementById('professorSearch').style.display = 'none';
    document.getElementById('professorHomework').style.display = 'none';

    document.getElementById('profNot').className = "";
    document.getElementById('profMarks').className = "";
    document.getElementById('profSearch').className = "";
    document.getElementById('profHomework').className = "";

    //enable one
    document.getElementById(content).style.display = 'block';
    if (content === "professorNotifications") {
        document.getElementById("profNot").className = "active";
        document.getElementById("professorNotifications").style.display = 'inline';
    } else if (content === "professorMarks") {
        document.getElementById('profMarks').className = "active";
    } else if (content === "professorSearch") {
        document.getElementById('profSearch').className = "active";
    } else if (content === "profHomework") {
        document.getElementById('profHomework').className = "active";
        document.getElementById("creationForm").style.display = 'block';
        professorHomework();
    }

}

function countMessages(data){
    var unreadMails = 0;
    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        if(!obj[i].isRead){
            unreadMails += 1;
        }
    }
    if(unreadMails != 0){
        document.getElementById("msgs").textContent = unreadMails;
    } else{
        document.getElementById("msgs").textContent = "";
    }
}

function professorSemesters(data, selectId) {
    $('#semesters')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select semester</option>')
        .val('null')
    ;

    $('#semestersHomework')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select semester</option>')
        .val('null')
    ;

    var selectDropDown = document.getElementById(selectId);

    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var opt = document.createElement('option');
        opt.value = obj[i].semesterId;
        opt.innerHTML = obj[i].semester;
        selectDropDown.appendChild(opt);
    }
}

function professorSubjects(data, selectId) {
    document.getElementById("subjectsDiv").style.display = 'inline';

    $('#subjectSelect')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select subject</option>')
        .val('null')
    ;
    $('#subjectSelectHome')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select subject</option>')
        .val('null')
    ;

    var selectDropDown = document.getElementById(selectId);

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
    /*document.getElementById("receiverId").value = obj[0].userId;*/
    document.getElementById("homeworkName").textContent = homeworkName;
    document.getElementById("homeworkDescription").textContent = homeworkDescription;
    document.getElementById("homeworkStudentName").textContent = studentName;
    document.getElementById("homeworkStudentAnswer").textContent = studentAnswer;

}

function professorHomework() {
    document.getElementById('professorHomework').style.display = 'block';
    document.getElementById("saved").style.display = 'none';
}

function professorNotifications(data) {
    $("#notifBody").empty();
    var table = document.getElementById("notifProf");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tableBody = table.getElementsByTagName('tbody')[0];
    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var row = tableBody.insertRow(0);
        row.className = "info";
        var from = row.insertCell(0);
        var subject = row.insertCell(1);
        from.appendChild(createLinkNotification(obj[i].senderFirstName + ' ' + obj[i].senderLastName, obj[i].id,obj[i].isRead));
        subject.innerHTML = obj[i].topic;
    }
}

function createLinkNotification(name, not_id, isRead) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(name);
    if(!isRead){
        var linkText = document.createTextNode(name + " NEW");
    }
    a.appendChild(linkText);
    a.title = not_id;
    a.onclick = function () {
        $.ajax({
                url: "/ois/openMessage/" + not_id
            })
            .done(function (data) {
                fillMessageBox(data);
                $("#readMessage").modal("show");
                document.getElementById("notificId").value = not_id;

            });


    };
    document.body.appendChild(a);
    return a;
}

function fillMessageBox(data) {
    var obj = JSON.parse(data);
    document.getElementById("from").textContent = obj[0].senderFirstName + " " + obj[0].senderLastName;
    document.getElementById("topic").textContent = obj[0].topic;
    document.getElementById("textNotif").textContent = obj[0].text;
}

function professorStatistics() {

}

function detailedInfo() {
    var table = document.getElementById("detailedInfo");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tBody = table.getElementsByTagName('tbody')[0];
    var name = document.getElementById("studentsAutocompl").value;
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

var data = [
    {value: "John Doe - 124578"},
    {value: "Anna Smith - 135478"},
    {value: "Peter Jones - 137964"},
];


function validateForm() {
    document.getElementById("errorLabel").style.display = "none";
    var grade = document.getElementById("homeworkGrade").value;
    if (grade < 1 || grade > 5) {
        event.preventDefault();
        document.getElementById("homeworkGrade").value = "";
        document.getElementById("errorLabel").style.display = "block";
    }


}

function validateFormCreate() {

    return true;
}

function clearForm() {
    $('#subjectSelectHome')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select subject</option>')
        .val('null')
    ;
    document.getElementById("hwNameCreationId").value = "";
    document.getElementById("hwDescriptionCreationId").value = "";
}



