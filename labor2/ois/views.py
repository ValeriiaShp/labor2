import json
from django.http import HttpResponse
from ois.models import HomeWorkUser
from ois.models import Notification


def notifications(request):
    notifications = Notification.objects.all()
    results = [n.as_json() for n in notifications()]
    return HttpResponse(json.dumps(results), content_type="application/json")


def marks(request):
    marks = HomeWorkUser.objects.all()
    results = [m.as_json() for m in marks()]
    return HttpResponse(json.dumps(results), content_type="application/json")


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
