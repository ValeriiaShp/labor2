import json
from django.contrib.auth import authenticate, login, logout
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


def statistics(request):
    pass
    # stastistics = Cat.objects.all()
    # results = [c.as_json() for c in allCats]
    # return HttpResponse(json.dumps(results), content_type="application/json")


def search(request):
    pass
    # allCats = Cat.objects.all()
    # results = [c.as_json() for c in allCats]
    # return HttpResponse(json.dumps(results), content_type="application/json")
