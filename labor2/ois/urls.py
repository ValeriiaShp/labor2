from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.login_page, name='index'),
    url(r'^logout/$', views.logout_page, name='logout'),
    url(r'^home/$', views.home, name='home'),
    url(r'^marks/(?P<homeworkCode>[\w-]+)/$', views.marks, name='marks'),
    url(r'^homeworks/(?P<subjectCode>[\w-]+)/$', views.homeworks, name='homeworks'),
    url(r'^semesters/$', views.semesters, name='semesters'),
    url(r'^putGrade/$', views.putGrade, name='putGrade'),
    url(r'^subjects/(?P<semesterCode>[\w-]+)/$', views.subjects, name='subjects'),
    url(r'^editHomeworkUser/(?P<homeWorkUserId>[\w-]+)/$', views.editHomeworkUser, name='editHomeworkUser'),
    url(r'^openMessage/(?P<messageId>[\w-]+)/$', views.openMessage, name='openMessage'),
    url(r'^editHomework/$', views.editHomework, name='editHomework'),
    url(r'^homework/(?P<homeWorkEditId>[\w-]+)/$', views.homework, name='homework'),
    url(r'^createHomework/$', views.createHomework, name='createHomework'),
    url(r'^studyresults/$', views.studyresults, name='studyresults'),
    url(r'^mygroups/$', views.mygroups, name='mygroups'),
    url(r'^freegroups/$', views.freegroups, name='freegroups'),
    url(r'^joinGroup/(?P<groupId>[\w-]+)/$', views.joinGroup, name='joinGroup'),
    url(r'^leaveGroup/(?P<groupId>[\w-]+)/$', views.leaveGroup, name='leaveGroup'),
    url(r'^newGroup/$', views.newGroup, name='newGroup'),
    url(r'^mysubjects/$', views.mysubjects, name='mysubjects'),
    url(r'^myhomeworks/(?P<subjectCode>[\w-]+)/$', views.myhomeworks, name='myhomeworks'),
    url(r'^myhomeworkstatus/(?P<homeworkCode>[\w-]+)/$', views.myhomeworkstatus, name='myhomeworkstatus'),
    url(r'^search/$', views.search, name='search'),
    url(r'^detailedInfo/(?P<detailedUserId>[\w-]+)/$', views.detailedInfo, name='detailedInfo'),
    url(r'^notifications/$', views.notifications, name='notifications'),
]
