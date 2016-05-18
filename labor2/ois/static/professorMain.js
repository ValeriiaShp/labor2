var fullJSON = [];
var isMark = true;
var detailedInfoJson;

$(document).ready(function () {
    $(function () {
        loadNotificationTable();
    });

    $("#profNotification").click(function () {
        loadNotificationTable();
    });

    $("#closeMsgButton").click(function () {
        $("#readMessage").modal('hide');
        loadNotificationTable();
    });

    function loadNotificationTable() {
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
    };

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

    $("#createNewHomeworkButton").click(function () {
        $.ajax({

                url: "/ois/semesters",

                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {
                loadContent("profHomework");
                professorSemesters(data, "semestersHomeworkNew");
                $("#homeworkDivCreation").modal("show");
                document.getElementById("hwListDiv").style.display = 'none';
            });

    });
    $("#closeCreationForm").click(function () {
        document.getElementById("hwListDiv").style.display = 'inline'
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

    $('#formEdit').submit(function () {
        $.ajax({
            data: $(this).serialize(),
            type: "POST",
            url: "/ois/editHomework/",
            success: function (data) {
                $('#homeworkEdit').modal('hide');
                professorHomeworksList(data);
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
                clearForm();
                professorHomeworksList(data);
                document.getElementById("hwListDiv").style.display = 'inline';
                $('#homeworkDivCreation').modal('hide');
            }
        });
        return false;
    });

    $('#semesters').change(function () {
        document.getElementById("subjectsDiv").style.display = 'none';


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

    $('#semestersHomeworkNew').change(function () {
        $.ajax({
                url: "/ois/subjects/" + this.options[this.selectedIndex].value
            })
            .done(function (data) {
                loadContent("profHomework");
                professorSubjects(data, "subjectSelectHomeNew");
            });

    });

    $('#subjectSelect').change(function () {
        document.getElementById("homeworkDiv").style.display = 'inline';
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
        //document.getElementById("homeworkDivCreation").style.display = 'block';
        $.ajax({
                url: "/ois/homeworks/" + this.options[this.selectedIndex].value,
                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {
                professorHomeworksList(data);
            });
    });

    $('#subjectSelectHomeNew').change(function () {
        var i = this.options[this.selectedIndex].value;
        //document.getElementById("homeworkDivCreation").style.display = 'block';
        document.getElementById("subjectHWCreationId").value = this.options[this.selectedIndex].value;
        $.ajax({
                url: "/ois/homeworks/" + this.options[this.selectedIndex].value,
                beforeSend: function (xhr) {
                    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            })
            .done(function (data) {

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
                        return {
                            label: item.label,
                            value: item.id
                        }
                    }));
                }
            });
        },
        select: function (event, ui) {
            $.ajax({
                    url: "/ois/detailedInfo/" + ui.item.value,
                    beforeSend: function (xhr) {
                        //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                    }
                })
                .done(function (data) {
                    detailedInfo(data)
                });
            ui.item.value = ui.item.label;
            return true;
        },
        minLength: 1
    });
});


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
        isMark = true;
        document.getElementById('profMarks').className = "active";
    } else if (content === "professorSearch") {
        document.getElementById('profSearch').className = "active";
    } else if (content === "profHomework") {
        document.getElementById('profHomework').className = "active";
        document.getElementById("creationForm").style.display = 'inline';
        professorHomework();
    }

}

function countMessages(data) {
    var unreadMails = 0;
    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        if (!obj[i].isRead) {
            unreadMails += 1;
        }
    }
    if (unreadMails != 0) {
        document.getElementById("msgs").textContent = unreadMails;
    } else {
        document.getElementById("msgs").textContent = "";
    }
}

function professorSemesters(data, selectId) {
    if (selectId == 'semesters') {
        $('#semesters')
            .find('option')
            .remove()
            .end()
            .append('<option value="null" disabled>Select semester</option>')
            .val('null')
        ;
        $('#subjectSelect')
            .find('option')
            .remove()
            .end()
            .append('<option value="null" disabled>Select subject</option>')
            .val('null')
    }
    if (selectId == 'semestersHomework') {
        $('#semestersHomework')
            .find('option')
            .remove()
            .end()
            .append('<option value="null" disabled>Select semester</option>')
            .val('null')
        ;
        $('#subjectSelectHome')
            .find('option')
            .remove()
            .end()
            .append('<option value="null" disabled>Select subject</option>')
            .val('null')
        ;
    }
    if (selectId == 'semestersHomeworkNew') {
        $('#semestersHomeworkNew')
            .find('option')
            .remove()
            .end()
            .append('<option value="null" disabled>Select semester</option>')
            .val('null')
        ;
        $('#subjectSelectHomeNew')
            .find('option')
            .remove()
            .end()
            .append('<option value="null" disabled>Select subject</option>')
            .val('null')
        ;
    }
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
    if (selectId == 'subjectSelect')
        $('#subjectSelect')
            .find('option')
            .remove()
            .end()
            .append('<option value="null" disabled>Select subject</option>')
            .val('null')
        ;
    if (selectId == 'subjectSelectHome')
        $('#subjectSelectHome')
            .find('option')
            .remove()
            .end()
            .append('<option value="null" disabled>Select subject</option>')
            .val('null')
        ;
    if (selectId == 'subjectSelectHomeNew')
        $('#subjectSelectHomeNew')
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

function professorHomeworksList(data) {
    $("#hwBody").empty();
    var table = document.getElementById("hwList");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tableBody = table.getElementsByTagName('tbody')[0];
    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var row = tableBody.insertRow(0);
        row.className = "info";
        var name = row.insertCell(0);
        var description = row.insertCell(1);
        name.appendChild(createLinkHomeworkEdit(obj[i].name, obj[i].selfId));
        description.innerHTML = obj[i].description;
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
    //document.getElementById('homeworkDivCreation').style.display = 'block';
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
        if (!obj[i].isRead) {
            row.bgColor = "LightGreen ";
        } else
            row.className = "info";
        var from = row.insertCell(0);
        var subject = row.insertCell(1);
        from.appendChild(createLinkNotification(obj[i].senderFirstName + ' ' + obj[i].senderLastName, obj[i].id, obj[i].isRead));
        subject.innerHTML = obj[i].topic;
    }
}

function createLinkHomeworkEdit(name, hw_id) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(name);
    a.appendChild(linkText);
    a.title = hw_id;
    a.onclick = function () {
        document.getElementById("hiddenInputHomeworkEdit").value = hw_id;
        $.ajax({
                url: "/ois/homework/" + hw_id
            })
            .done(function (data) {
                fillHomeworkEditModal(data);
                $("#homeworkEdit").modal("show");
                document.getElementById("hiddenInputHomeworkEdit").value = hw_id;

            });


    };
    document.body.appendChild(a);
    return a;
}

function createLinkNotification(name, not_id, isRead) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(name);
    if (!isRead) {
        var linkText = document.createTextNode(name + "(NEW)");
    }
    a.appendChild(linkText);
    a.title = not_id;
    a.style.color = "black";
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

function fillHomeworkEditModal(data) {
    var obj = JSON.parse(data);
    document.getElementById("homeworkNameEdit").value = obj[0].name;
    document.getElementById("homeworkDescriptionEdit").value = obj[0].description;
}

function detailedInfo(data) {
    $("#detailsBody").empty();
    var table = document.getElementById("detailedInfoTable");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tableBody = table.getElementsByTagName('tbody')[0];
    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var row = tableBody.insertRow(0);
        row.className = "info";
        var subjectName = row.insertCell(0);
        var subjectCode = row.insertCell(1);
        var homeworkName = row.insertCell(2);
        var studentAnswer = row.insertCell(3);
        var grade = row.insertCell(4);
        subjectName.innerHTML = obj[i].homeWorkSubjectName;
        subjectCode.innerHTML = obj[i].homeWorkSubjectCode;
        homeworkName.innerHTML = obj[i].homeWorkName;
        if (obj[i].answer != null) {
            studentAnswer.innerHTML = obj[i].answer;
        } else {
            studentAnswer.innerHTML = "Is not submitted yet!";
        }
        if (obj[i].mark != null) {
            grade.innerHTML = obj[i].mark;
        } else {

            grade.innerHTML = "Not graded yet!"
        }
    }
    document.getElementById("detailedInfoTable").style.display = 'inline';
}

function createLinkGrade(homework_id, initialJson) {
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
                document.getElementById("hiddenInputId").textContent = homework_id;
                fillEditData(data, homework_id);
                $("#changeGrade").modal("show");
                isMark = false;
                detailedInfoJson = initialJson;
            });

    };
    document.body.appendChild(a);
    return a;
}

function validateForm() {
    document.getElementById("errorLabel").style.display = "none";
    var grade = document.getElementById("homeworkGrade").value;
    var label = document.getElementById("errorLabel");
    if (isNaN(parseInt(grade))) {
        event.preventDefault();
        document.getElementById("homeworkGrade").value = "";
        label.value = "Please enter a number!"
        label.style.display = "block";
    }
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



