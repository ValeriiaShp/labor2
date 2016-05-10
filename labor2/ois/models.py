from django.conf import settings
from django.db import models


class Semester(models.Model):
    number = models.CharField(max_length=11)
    start_date = models.DateField()
    end_date = models.DateField()


class Subject(models.Model):
    code = models.IntegerField()
    name = models.CharField(max_length=400)
    description = models.TextField()
    semester = models.ForeignKey(Semester)


class HomeWork(models.Model):
    name = models.CharField(max_length=400)
    description = models.TextField()
    subject = models.ForeignKey(Subject)


class HomeWorkUser(models.Model):
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL)
    id_homework = models.ForeignKey(HomeWork)
    answer = models.TextField()
    mark = models.IntegerField()
    group_work = models.BooleanField()


class SubjectUser(models.Model):
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL)
    id_subject = models.ForeignKey(Subject)


class Notification(models.Model):
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='receiver')
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sender')
    is_read = models.BooleanField(default=False)
    text = models.TextField()


class Group(models.Model):
    name = models.CharField(max_length=400)
