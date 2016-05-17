import json
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
from ois.models import Semester
from ois.models import HomeWork
from ois.models import SubjectUser

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

def notifications(request):
    notifications = Notification.objects.all()
    results = [n.as_json() for n in notifications]
    return HttpResponse(json.dumps(results), content_type="application/json")


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



