from django.conf import settings
from django.db import models


class Semester(models.Model):
    name = models.CharField(max_length=16)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name


class SemesterUser(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL)
    semester_id = models.ForeignKey(Semester)


class Subject(models.Model):
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=400)
    description = models.TextField()
    semester = models.ForeignKey(Semester)

    def __str__(self):
        return self.code + " - " + self.name + " (" + str(self.semester) + " )"


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


class StudentGroup(models.Model):
    name = models.CharField(max_length=400)


class StudentGroupUser(models.Model):
    student_group_id = models.ForeignKey(StudentGroup)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL)
