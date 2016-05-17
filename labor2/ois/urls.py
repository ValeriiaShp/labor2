from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.login_page, name='index'),
    url(r'^logout/$', views.logout_page, name='logout'),
    url(r'^home/$', views.home, name='home'),
    url(r'^notifications/$', views.notifications, name='add'),
    url(r'^marks/(?P<homeworkCode>[\w-]+)/$', views.marks, name='marks'),
    url(r'^homeworks/(?P<subjectCode>[\w-]+)/$', views.homeworks, name='homeworks'),
    url(r'^search/$', views.search, name='search'),
    url(r'^semesters/$', views.semesters, name='semesters'),
    url(r'^putGrade/$', views.putGrade, name='putGrade'),
    url(r'^subjects/(?P<semesterCode>[\w-]+)/$', views.subjects, name='subjects'),
    url(r'^editHomeworkUser/(?P<homeWorkUserId>[\w-]+)/$', views.editHomeworkUser, name='editHomeworkUser'),
    url(r'^openMessage/(?P<messageId>[\w-]+)/$', views.openMessage, name='openMessage'),
    url(r'^editHomework/$', views.editHomework, name='editHomework'),
    url(r'^homework/(?P<homeWorkEditId>[\w-]+)/$', views.homework, name='homework'),
    url(r'^createHomework/$', views.createHomework, name='createHomework'),
    url(r'^search/$', views.search, name='search'),
    url(r'^notifications/$', views.notifications, name='notifications'),
]
