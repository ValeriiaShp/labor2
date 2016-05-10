from django.conf.urls import url

from . import views

urlpatterns = [
   # url(r'^$', views.login, name='index'),
    url(r'^notifications/$', views.notifications, name='add'),
    url(r'^marks/$', views.marks, name='marks'),
    url(r'^search/$', views.search, name='search'),
]
