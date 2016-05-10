from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.login_page, name='index'),
    url(r'^logout/$', views.logout_page, name='logout'),
    url(r'^home/$', views.home, name='home'),
    url(r'^notifications/$', views.notifications, name='add'),
    url(r'^marks/$', views.marks, name='marks'),
    url(r'^search/$', views.search, name='search'),
]
