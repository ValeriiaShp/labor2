function viewHomeWork(hw_id) {

}

function groupsView() {
        loadContent("studentStudentGroups");
        $.ajax({
                url: "/ois/mygroups",
            })
            .done(function (data) {
                initMyGroups(data);
            });

        $.ajax({
                url: "/ois/freegroups",
            })
            .done(function (data) {
                initFreeGroups(data);
            });

}

function joinGroup(group_id) {
    $.ajax({
        url: "/ois/joinGroup/" + group_id,
    })
    .done(function (data) {
        groupsView();
    });
}

function leaveGroup(group_id) {
    $.ajax({
        url: "/ois/leaveGroup/" + group_id,
    })
    .done(function (data) {
        groupsView();
    });
}

function studentSubjects(data) {
    $('#stud_subm_subjects')
        .find('option')
        .remove()
        .end()
        .append('<option value="null" disabled>Select subject</option>')
        .val('null')
    ;

    var selectDropDown = document.getElementById("stud_subm_subjects");

    var obj = JSON.parse(data);
    for (var i = 0; i < obj.length; i++) {
        var opt = document.createElement('option');
        opt.value = obj[i].subject_id;
        opt.innerHTML = obj[i].subject_label;
        selectDropDown.appendChild(opt);
    }
}

function loadNotificationTable() {
        $.ajax({

                url: "/ois/notifications",
            })
            .done(function (data) {
                studentNotifications(data);
            });
    };


$(document).ready(function () {
    $(function(){
        loadNotificationTable();        
        loadContent("notifications");
    });

    $("#studNotification").click(function () {
        loadNotificationTable();
        loadContent("notifications");
    });

    $("#closeMsgButton").click(function () {
        $("#readMessage").modal('hide');
        loadNotificationTable();
    });

    
    $("#studResults").click(function () {
        $.ajax({

                url: "/ois/studyresults",
            })
            .done(function (data) {
                loadContent("studentStudyResults");
                initGrades(data);
            });

    });


    //studentWorkSubmission

    $("#studSubmussions").click(function() {

            $.ajax({

                url: "/ois/mysubjects",
            })
            .done(function (data) {
                loadContent("studentWorkSubmission");
                studentSubjects(data);
            });


    });

    $('#stud_subm_subjects').change(function () {
        $.ajax({
                url: "/ois/myhomeworks/" + this.options[this.selectedIndex].value
            })
            .done(function (data) {

                fillHomeworks(data);
                //loadContent("profHomework");
                //professorSubjectsCreation(data);

                //alert(data);
            });

    });

    $("#studGroups").click(function () {
        groupsView();

    });


    $("#newGroupBtn").click(function () {
        $("#newGroup").modal("show");

    });    

    $('#formGroup').submit(function() {
        $.ajax({
            data: $(this).serialize(),
            type: "POST",
            url: "/ois/newGroup/",
            success: function(data) {
                //document.getElementById("saved").style.display = 'block';
                //clearForm();

                $("#newGroup").modal("hide");
                groupsView();

            }
        });
        return false;
    });

});


function loadContent(content) {
    loadNotificationTable();
    if (content === 'logout') {
        window.location = "../login.html";
    }
    //disable others
    document.getElementById('notifications').style.display = 'none';
    document.getElementById('studentStudyResults').style.display = 'none';
    document.getElementById('studentWorkSubmission').style.display = 'none';
    document.getElementById('studentStudentGroups').style.display = 'none';
    //enable one
    document.getElementById(content).style.display = 'block';

    document.getElementById('studNotification').className = "";
    document.getElementById('studResults').className = "";
    document.getElementById('studSubmussions').className = "";
    document.getElementById('studGroups').className = "";

    

    //enable one
    document.getElementById(content).style.display = 'block';
    if (content === "notifications") {
        document.getElementById("studNotification").className = "active";
    } else if (content === "studentStudyResults") {
        document.getElementById('studResults').className = "active";
    } else if (content === "studentWorkSubmission") {
        document.getElementById('studSubmussions').className = "active";
    } else if (content === "studentStudentGroups") {
        document.getElementById('studGroups').className = "active";
    }

}

function studentNotifications(data) {

    notificationsJSON = JSON.parse(data)

    unreadNotifications = 0;

    var table = document.getElementById("notificationsTable");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tBody = table.getElementsByTagName('tbody')[0];

    for (var i = 0; i < notificationsJSON.length; i++) {
        var row = tBody.insertRow(0);
        var from = row.insertCell(0);
        var subject = row.insertCell(1);
        from.appendChild(createLinkNotification(notificationsJSON[i].senderFirstName + ' ' + notificationsJSON[i].senderLastName, notificationsJSON[i].id, notificationsJSON[i].isRead));
        subject.innerHTML = notificationsJSON[i].topic;

        if (!notificationsJSON[i].isRead ) {

            unreadNotifications++;
        }


    }

    populateUnreadNotificationsToNavbar();

/*
    for (var i = 0; i < notificationsJSON.length; i++) {

        var row1 = tBody.insertRow(0);
        var nameCell = row1.insertCell(0);

        var span1 = document.createElement('span');
        nameCell.appendChild(span1);

        var span2 = document.createElement('span');
        span2.innerHTML = notificationsJSON[i].senderFirstName + " " + notificationsJSON[i].senderLastName + " ";
        span1.appendChild(span2);

        var span3 = document.createElement('span');
        span3.className = 'badge';
        span3.innerHTML = 'NEW';
        span1.appendChild(span3);



        var emailCell = row1.insertCell(1);
        emailCell.innerHTML = notificationsJSON[i].topic;

        if (!notificationsJSON[i].isRead ) {

            unreadNotifications++;
        } else {
            span3.style.display = 'none';
        }
    }
*/
    
}

function createLinkNotification(name, not_id, isRead) {
    var a = document.createElement('a');
    var linkText = document.createElement("span");
    linkText.innerHTML = name;
    if (!isRead) {
        linkText.innerHTML = (name + " <span class='badge'>NEW</span>");
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

function initGrades(data) {

    gradesJSON = JSON.parse(data)

    var table = document.getElementById("gradesTable");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tBody = table.getElementsByTagName('tbody')[0];
    for (var i = 0; i < gradesJSON.length; i++) {



        // insert marks

        for (var j = 0; j < gradesJSON[i].grades.length; j++) {
            var row2 = tBody.insertRow(0);
            var code2 = row2.insertCell(0);
            var title2 = row2.insertCell(1);
            var prof_name2 = row2.insertCell(2);
            var mark2 = row2.insertCell(3);

            code2.innerHTML = gradesJSON[i].grades[j].subject_code;
            title2.innerHTML = gradesJSON[i].grades[j].subject_title;
            prof_name2.innerHTML = gradesJSON[i].grades[j].subject_professor_name;
            mark2.innerHTML = gradesJSON[i].grades[j].mark;
        }

                // insert sem

        var row = tBody.insertRow(0);
        var sem = row.insertCell(0);
        sem.colSpan = 4;
        sem.innerHTML = gradesJSON[i].semester;
    }

}

function fillHomeworks(data) {
    homeworkJSON = JSON.parse(data);

    var table = document.getElementById("my_grades");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tBody = table.getElementsByTagName('tbody')[0];

    for (var i = 0; i < homeworkJSON.length; i++) {

        var row = tBody.insertRow(0);
        var name = row.insertCell(0);
        var grade = row.insertCell(1);
        var view = row.insertCell(2);

        name.innerHTML = homeworkJSON[i].hw_name;
        grade.innerHTML = homeworkJSON[i].grade;

        view.innerHTML = '<button class="btn btn-info" onclick="viewHomeWork(' + homeworkJSON[i].hw_id + ')">View</button>';

    }
}

function initMyGroups(data){
    workgroupsJSON = JSON.parse(data);

    var table = document.getElementById("my_groups");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tBody = table.getElementsByTagName('tbody')[0];

    for (var i = 0; i < workgroupsJSON.length; i++) {

        var row = tBody.insertRow(0);
        var name = row.insertCell(0);
        var members = row.insertCell(1);
        var leave = row.insertCell(2);

        name.innerHTML = workgroupsJSON[i].name;
        members.innerHTML = workgroupsJSON[i].members;

        leave.innerHTML = '<button class="btn btn-danger" onclick="leaveGroup(' + workgroupsJSON[i].group_id + ')">Leave</button>';

    }

}

function initFreeGroups(data){
    workgroupsJSON = JSON.parse(data);

    var table = document.getElementById("free_groups");
    table.tBodies[0].remove();
    table.appendChild(document.createElement('tbody'));
    var tBody = table.getElementsByTagName('tbody')[0];

    for (var i = 0; i < workgroupsJSON.length; i++) {

        var row = tBody.insertRow(0);
        var name = row.insertCell(0);
        var members = row.insertCell(1);
        var leave = row.insertCell(2);

        name.innerHTML = workgroupsJSON[i].name;
        members.innerHTML = workgroupsJSON[i].members;
        leave.innerHTML = '<button class="btn btn-success" onclick="joinGroup(' + workgroupsJSON[i].group_id + ')">Join</button>'

    }
}


function initSubmissions() {

    var submissionsHTML = document.getElementById("submissions");

    for (var i = 0; i < submissionsJSON.submissions.length; i++) {

        var ppp = document.createElement('p');
        var span1 = document.createElement('span');
        span1.innerHTML = submissionsJSON.submissions[i].subject;
        ppp.appendChild(span1);
        var brr = document.createElement('br');
        ppp.appendChild(brr);
        var span2 = document.createElement('span');
        span2.innerHTML = "<b>Task: " + submissionsJSON.submissions[i].task + " </b> URL: ";
        ppp.appendChild(span2);

        var idd = "submission" + i;
        var span3 = document.createElement('span');
        span3.id = idd + "link";
        ppp.appendChild(span3);
        if (submissionsJSON.submissions[i].link != null) {

            span3.innerHTML = submissionsJSON.submissions[i].link + " ";



            var span4 = document.createElement('span');
            span4.className = 'badge';
            if (submissionsJSON.submissions[i].grade != null) {
                span4.innerHTML = submissionsJSON.submissions[i].grade;
            } else {
                span4.innerHTML = "Not graded yet";
            }

            ppp.appendChild(span4);

        } else {
            span3.innerHTML = " ";


            var inp = document.createElement('input');
            inp.id = idd + "inp";
            ppp.appendChild(inp);

            var span4 = document.createElement('span');
            span4.innerHTML = ' <button class="btn btn-info" onclick="submitTask(\'' + idd + '\', this)">Submit</button> ';
            ppp.appendChild(span4);

            var span5 = document.createElement('span');
            span5.id=idd+"sp";
            span5.className = 'badge';
            span5.innerHTML = 'Not submitted yet';
            ppp.appendChild(span5);
        }

        submissionsHTML.appendChild(ppp);

    }

}

function populateUnreadNotificationsToNavbar() {
    var el = document.getElementById('unreadNotifications');
    if (unreadNotifications > 0) {
        el.style.display = 'inline-block';
        el.innerHTML = "" + unreadNotifications;

    } else {
        el.style.display = 'none';
    }
}

function addToGroup(workgroupid, btn) {
    btn.style.display = 'none';
    var group = document.getElementById(workgroupid);

    var initText = group.innerHTML;

    if (initText != "") {
        initText += ", ";
    }

    initText+="Me";
    group.innerHTML = initText;
}

function submitTask(submitid, btn) {
    var inpField = document.getElementById(submitid+"inp");
    var inputFieldText = inpField.value;

    btn.style.display = 'none';

    inpField.style.display = 'none';
    document.getElementById(submitid+"link").innerHTML = inputFieldText;
    document.getElementById(submitid+"sp").innerHTML = "Not graded yet";
/*
    var initText = group.innerHTML;

    if (initText != "") {
        initText += ", ";
    }

    initText+="Me";
    group.innerHTML = initText;*/
}

/*
function upd() {
    notificationsJSON.notifications[0].unread = false;
    initNotifications();
}*/