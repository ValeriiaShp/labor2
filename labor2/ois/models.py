from django.db import models

class Semester(models.Model):
    number = models.CharField(max_length=11)
	start_date = models.DateField()
	end_date = models.DateField()
	
class Subject(models.Model):
	code = models.IntegerField()
	name =  models.CharField(max_length=400)
	description =  models.TextField()
	
class HomeWork(models.Model):
	name =  models.CharField(max_length=400)
	description =  models.TextField()

class HomeWorkUser(models.Model):
	id_user = models.ForeignKey(User)
	id_homework = models.ForeignKey(HomeWork)
	answer = models.TextField()
	mark = models.IntegerField()
	
class SubjectUser(models.Model):
	id_user = models.ForeignKey(User)
	id_subject = models.ForeignKey(Subject)