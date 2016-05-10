from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^add/$', views.add, name='add'),
    url(r'^list/$', views.catlist, name='catlist'),
    url(r'^all/$', views.all, name='all'),
    url(r'^cats/(?P<cat_slug>[\w-]+)/$', views.cat, name='cat'),
]