import json

from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from murr.models import Cat
from murr.models import Color


# Create your views here.

def index(request):
    return HttpResponseRedirect(reverse('add'))
def add(request):
    
    if request.method == 'POST':
        context = {}
        clr = Color.objects.filter(id=request.POST['color'])[:1].get()
        c = Cat(name=request.POST['name'], birth_year=request.POST['birth_year'], color=clr)
        c.save()
        return HttpResponseRedirect(reverse('all'))
    else:
        allColors = Color.objects.all()
        colors_list = [{"id" : c.id, "name" : c.name} for c in allColors]
        context = {"colors_list" : colors_list}
        return render(request, 'murr/index.html', context)


def catlist(request):
    allCats = Cat.objects.all()
    results = [c.as_json() for c in allCats]
    return HttpResponse(json.dumps(results), content_type="application/json")

def all(request):
    context = {}
    return render(request, 'murr/all.html', context)


def cat(request, cat_slug=""):
    catt = Cat.objects.filter(slug=cat_slug)[:1].get()
    #    results = [c.as_json() for c in allCats]
    return HttpResponse(json.dumps(catt.as_json()), content_type="application/json")
