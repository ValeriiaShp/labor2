from __future__ import unicode_literals

from django.conf import settings
from django.db import models


class Semester(models.Model):
    name = models.CharField(max_length=16)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name

    def as_json(self):
        return dict(name=self.name, startDate=self.start_date, endDate=self.end_date)


class SemesterUser(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL)
    semester_id = models.ForeignKey(Semester)

    def __str__(self):
        return str(self.user_id) + " - " + str(self.semester_id)

    def as_json(self):
        return dict(userFirstName=self.user_id.first_name, userLastName=self.user_id.last_name,
                    semester=self.semester_id.name, semesterId=self.semester_id.id,
                    selfId=self.id)


class Subject(models.Model):
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=400)
    description = models.TextField()
    semester = models.ForeignKey(Semester)
    professor = models.ForeignKey(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.code + " - " + self.name + " (" + str(self.semester) + " )"

    def as_json(self):
        return dict(name=self.name, code=self.code, description=self.description, semester=self.semester.name,
                    professor=(self.professor.first_name + self.professor.last_name),
                    professorId=self.professor.id,
                    selfId=self.id)


class HomeWork(models.Model):
    name = models.CharField(max_length=400)
    description = models.TextField()
    subject = models.ForeignKey(Subject)

    def __str__(self):
        return self.name

    def as_json(self):
        return dict(name=self.name, description=self.description, subject=self.subject.name,
                    subjectCode=self.subject.code, selfId=self.id)


class HomeWorkUser(models.Model):
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL)
    id_homework = models.ForeignKey(HomeWork)
    answer = models.TextField(null=True, blank=True)
    mark = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.id_user.first_name + " " + self.id_user.last_name + " is registered to " + self.id_homework.name

    def as_json(self):
        return dict(answer=self.answer, mark=self.mark, userName=(self.id_user.first_name+' '+self.id_user.last_name),
                    homeworkName=self.id_homework.name,
                    homeworkDescription=self.id_homework.description,
                    homeWorkSubjectName=self.id_homework.subject.name,
                    homeWorkSubjectCode=self.id_homework.subject.code,
                    homeWorkName=self.id_homework.name,
                    homeworkId=self.id_homework.id,
                    selfId=self.id)


class SubjectUser(models.Model):
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL)
    id_subject = models.ForeignKey(Subject)

    def __str__(self):
        return str(self.id_subject) + " is performed by " + self.id_user.first_name + " " + self.id_user.last_name

    def as_json(self):
        return dict(userFirstName=self.user_id.first_name, userLastName=self.user_id.last_name,
                    subjectName=self.id_subject.name, subjectCode=self.id_subject.code)


class Notification(models.Model):
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='receiver')
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sender')
    is_read = models.BooleanField(default=False)
    topic = models.CharField(max_length=50)
    text = models.TextField()

    def as_json(self):
        return dict(receiver=self.to_user.id, senderFirstName=self.from_user.first_name,
                    senderLastName=self.from_user.last_name, isRead=self.is_read,
                    topic=self.topic, text=self.text)


class StudentGroup(models.Model):
    name = models.CharField(max_length=400)

    def as_json(self):
        return dict(name=self.name)


class StudentGroupUser(models.Model):
    student_group_id = models.ForeignKey(StudentGroup)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL)

    def as_json(self):
        return dict(groupName=self.student_group_id.name, userLastName=self.user_id.last_name)
