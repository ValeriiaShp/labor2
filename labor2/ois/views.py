import json
import time
import logging
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.contrib.auth.models import Group
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from ois.models import HomeWorkUser
from ois.models import Notification
from ois.models import SemesterUser
from ois.models import Subject
from ois.models import SubjectUser
from ois.models import Semester
from ois.models import HomeWork
from ois.models import StudentGroup
from ois.models import StudentGroupUser


def is_professor(user):
    users_in_group = Group.objects.get(name="Professor").user_set.all()
    return user in users_in_group

def is_student(user):
    users_in_group = Group.objects.get(name="Student").user_set.all()
    return user in users_in_group


def login_page(request):
    if request.method == "POST":
        username = request.POST['login']
        password = request.POST['pwd']
        user = authenticate(username = username, password = password)

        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(reverse('home'))
            else:
                return render(request, 'login.html', {"login_error" : "Inactive account. Please, contact administrator!"})
        else:
            return render(request, 'login.html', {"login_error" : "Invalid credentials!"})

    else:
        return render(request, 'login.html', {})

def home(request):
    user = request.user
    if user.is_authenticated():
        if is_professor(user):
            return render(request, 'professor/professorHeader.html', {})
        elif is_student(user):
            return render(request, 'student/studentHeader.html', {})
        else:
            return HttpResponseRedirect(reverse('index'))
    else:
        return HttpResponseRedirect(reverse('index'))

def logout_page(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

def marks(request, homeworkCode):
    homeworks = HomeWork.objects.get(pk=homeworkCode)
    marks = HomeWorkUser.objects.filter(id_homework=homeworks)
    results = [m.as_json() for m in marks]
    return HttpResponse(json.dumps(results))

def homeworks(request, subjectCode):
    subjects = Subject.objects.get(pk=subjectCode)
    homeworks = HomeWork.objects.filter(subject=subjects)
    results = [m.as_json() for m in homeworks]
    return HttpResponse(json.dumps(results))

def editHomeworkUser(request, homeWorkUserId):
    homeworkUser = HomeWorkUser.objects.filter(pk=homeWorkUserId)
    results = [m.as_json() for m in homeworkUser]
    return HttpResponse(json.dumps(results))

def putGrade(request):
    context = {}
    idHW = int(request.POST['hiddenInputHomeworkUserId'])
    homeworkUser = HomeWorkUser.objects.filter(id=idHW)
    homeworkUser.update(mark=request.POST['homeworkGrade'])
    homeworkId = int(request.POST['hiddenInputHomeworkId'])
    homeworks = HomeWork.objects.get(pk=homeworkId)
    marks = HomeWorkUser.objects.filter(id_homework=homeworks)
    messageText = "You have a grade " + request.POST['homeworkGrade'] + " on homework - " + homeworks.name
    notification = Notification(to_user=homeworkUser[0].id_user, from_user=request.user, topic="You have a new grade",text=messageText )
    notification.save()
    results = [m.as_json() for m in marks]
    return HttpResponse(json.dumps(results))

def createHomework(request):
    context = {}
    idSubject = request.POST["subjectHWCreation"]
    subjectC = Subject.objects.get(pk = idSubject)
    homeworkDescription = request.POST["hwDescriptionCreation"]
    homeworkName = request.POST["hwNameCreation"]
    h = HomeWork(name=homeworkName,description=homeworkDescription,subject=subjectC)
    h.save()
    subjectUser = list(SubjectUser.objects.filter(id_subject=subjectC))
    messageText = "You have a new homework \"" + homeworkName + "\" on subject - " + subjectC.name
    for su in subjectUser:
        if is_student(su.id_user):
            hwu = HomeWorkUser(id_user=su.id_user,id_homework=h)
            hwu.save()
            notification = Notification(to_user=su.id_user, from_user=request.user, topic="You have a new homework",text=messageText )
            notification.save()
    homeworks = HomeWork.objects.filter(subject=subjectC)
    results = [m.as_json() for m in homeworks]
    return HttpResponse(json.dumps(results))

def semesters(request):
    user = request.user
    semesters = SemesterUser.objects.filter(user_id=user)
    results = [m.as_json() for m in semesters]
    return HttpResponse(json.dumps(results))

def subjects(request, semesterCode):
    semester = Semester.objects.get(pk=semesterCode)
    subjects = Subject.objects.filter(semester=semester, professor=request.user)
    results = [m.as_json() for m in subjects]
    return HttpResponse(json.dumps(results))

def notifications(request):
    user = request.user
    notifications = Notification.objects.filter(to_user=user)
    notifications = notifications.extra(order_by = ['-is_read'])
    results = [m.as_json() for m in notifications]
    return HttpResponse(json.dumps(results))


def openMessage(request, messageId):
    notification = Notification.objects.filter(id=messageId)
    notification.update(is_read=True)
    results = [m.as_json() for m in notification]
    return HttpResponse(json.dumps(results))

def homework(request, homeWorkEditId):
    homework = HomeWork.objects.filter(id=homeWorkEditId)
    results = [m.as_json() for m in homework]
    return HttpResponse(json.dumps(results))

def editHomework(request):
    homework = HomeWork.objects.get(pk=request.POST["hiddenInputHomeworkEdit"])
    homework.name=request.POST["homeworkNameEdit"]
    homework.description=request.POST["homeworkDescriptionEdit"]
    homework.save()
    homeWorks = HomeWork.objects.filter(subject=homework.subject)
    results = [m.as_json() for m in homeWorks]
    return HttpResponse(json.dumps(results))

def search(request):
    data_dict = json.loads(request.GET.get('json_data'))
    enteredString = data_dict['enteredString']['nameStartsWith']
    search_qs = User.objects.filter(Q(first_name__startswith=enteredString)|Q(last_name__startswith=enteredString))
    results = []
    for user in search_qs:
        if is_student(user):
            user_json = {}
            user_json['id'] = user.id
            user_json['label'] = user.first_name + ' ' + user.last_name
            user_json['value'] = user.first_name + ' ' + user.last_name
            results.append(user_json)
    data = json.dumps(results)
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

def detailedInfo(request, detailedUserId):
    homeworkUsers = HomeWorkUser.objects.filter(id_user=detailedUserId)
    results = [m.as_json() for m in homeworkUsers]
    return HttpResponse(json.dumps(results))

def studyresults(request):
    student = request.user
    semesterUsers = SemesterUser.objects.filter(user_id=student)

    semesters = [c.semester_id for c in semesterUsers]

    #s = semesters.reverse()

    subjectsForStudent = SubjectUser.objects.filter(id_user = student)
    subjectsForStudentIds = set([c.id for c in subjectsForStudent])

    results = []

    for semester in semesters:
        resultForCurrentSemester = {}
        resultForCurrentSemester['semester'] = semester.name

        grades = []

        subjectsInSem = Subject.objects.filter(semester=semester)

        subjectsInSemIds = set([c.id for c in subjectsInSem])

        subjects = subjectsForStudentIds & subjectsInSemIds

        for subject in subjects:

            s = Subject.objects.get(pk = subject)

            grades.append({'subject_code' : s.code, 'subject_title' : s.name, 'subject_professor_name' : (s.professor.first_name + " " + s.professor.last_name), 'mark' : '5'})

        resultForCurrentSemester['grades'] = grades

        results.append(resultForCurrentSemester)
        




    return HttpResponse(json.dumps(results))


def mygroups(request):

    student = request.user

    studenGroupUsers = StudentGroupUser.objects.filter(user_id = student)

    studentGroups = [c.student_group_id for c in studenGroupUsers]

    results = []

    for studentGroup in studentGroups:
        allMembers = StudentGroupUser.objects.filter(student_group_id = studentGroup)

        allMembersStr = ""

        for c in allMembers:
            allMembersStr += c.user_id.first_name + " " + c.user_id.last_name + "; "

        results.append({'name' : studentGroup.name, 'members' : allMembersStr, 'group_id' : studentGroup.id})
    

    

    return HttpResponse(json.dumps(results))



def freegroups(request):

    student = request.user
    
    allGroups = StudentGroup.objects.all()

    allGroupsIds = set([c.id for c in allGroups])


    studenGroupUsers = StudentGroupUser.objects.filter(user_id = student)

    studentGroups = [c.student_group_id for c in studenGroupUsers]

    studentGroupsIds = set([c.id for c in studentGroups])

    freeGroupsIds = allGroupsIds - studentGroupsIds

    results = []

    for freeGroupId in freeGroupsIds:
    #for studentGroup in studentGroups:
        studentGroup = StudentGroup.objects.get(pk=freeGroupId)
        allMembers = StudentGroupUser.objects.filter(student_group_id = studentGroup)

        allMembersStr = ""

        for c in allMembers:
            allMembersStr += c.user_id.first_name + " " + c.user_id.last_name + "; "

        results.append({'name' : studentGroup.name, 'members' : allMembersStr, 'group_id' : studentGroup.id})
    

    

    return HttpResponse(json.dumps(results))

def joinGroup(request, groupId):

    student = request.user
    group = StudentGroup.objects.get(pk=groupId)

    studentGroupUser = StudentGroupUser.objects.filter(student_group_id = group, user_id = student)

    if not studentGroupUser:
        g = StudentGroupUser(student_group_id = group, user_id = student)
        g.save()


    return HttpResponse('OK')



def leaveGroup(request, groupId):

    student = request.user
    group = StudentGroup.objects.get(pk=groupId)

    studentGroupUsers = StudentGroupUser.objects.filter(student_group_id = group, user_id = student)

    for studentGroupUser in studentGroupUsers:
        studentGroupUser.delete()

    studentGroupUsers = StudentGroupUser.objects.filter(student_group_id = group)

    if not studentGroupUsers:
        group.delete();



    return HttpResponse('OK')


def newGroup(request):

    student = request.user

    name = request.POST['groupName']

    if name == "":
        name = "Group" + str(time.time())

    g = StudentGroup(name = name)
    g.save();

    gu = StudentGroupUser(student_group_id = g, user_id = student)
    gu.save()


    return HttpResponse('OK')

def mysubjects(request):
    student = request.user

    semester = lastSemester()

    allSubjInSem = Subject.objects.filter(semester = semester)

    allSubjInSemIds = set([c.id for c in allSubjInSem])

    subjectUsers = SubjectUser.objects.filter(id_user = student)
    subjectUsersIds = set([c.id for c in subjectUsers])

    results = []

    resultSubjectSetIds = allSubjInSemIds & subjectUsersIds

    for subjectId in resultSubjectSetIds:
        subject = Subject.objects.get(pk=subjectId)
        results.append({'subject_id' : subjectId, 'subject_label' : subject.code + " - " + subject.name})



    return HttpResponse(json.dumps(results))

def lastSemester():
    s = Semester.objects.all().extra(order_by = ['-end_date'])
    return s[0]

def myhomeworks(request, subjectCode):

    student = request.user

    subject = Subject.objects.get(pk=subjectCode)

    homeworks = HomeWork.objects.filter(subject = subject)

    print([{'name' : c.name} for c in homeworks])

    results = []

    for homework in homeworks:

        print("cur: " + homework.name)

        homeworkuser = HomeWorkUser.objects.filter(id_user = student, id_homework = homework)

        if not homeworkuser:
            print("not exist")
            homeworkuserOne = HomeWorkUser(id_user = student, id_homework = homework)
            homeworkuserOne.save()
        else:
            print("exists")
            homeworkuserOne = homeworkuser[0]

        if not homeworkuserOne.mark:
            if not homeworkuserOne.answer:
                grade = "Not submitted yet"
            else:
                grade = "Not graded yet"
        else:
            grade = "" + str(homeworkuserOne.mark)

        results.append({'hw_id' : homework.id, 'hw_name' : homework.name, 'grade' : grade})


    return HttpResponse(json.dumps(results))

def myhomeworkstatus(request, homeworkCode):

    student = request.user

    homework = HomeWork.objects.get(pk=homeworkCode)

    homeworkuser = HomeWorkUser.objects.filter(id_user = student, id_homework = homework)[0]

    results = {'hw_name' : homework.name, 'hw_desc' : homework.description, 'hwu_answer' : homeworkuser.answer, 'hwu_grade' : homeworkuser.mark, 'hwu_id' : homeworkuser.id}


    return HttpResponse(json.dumps(results))
