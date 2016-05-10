from django.contrib import admin

from .models import Semester
from .models import Subject
from .models import HomeWork
from .models import HomeWorkUser
from .models import SubjectUser
from .models import Notification
from .models import StudentGroup
from .models import StudentGroupUser

# Register your models here.

admin.site.register(Semester)
admin.site.register(Subject)
admin.site.register(HomeWork)
admin.site.register(HomeWorkUser)
admin.site.register(SubjectUser)
admin.site.register(Notification)
admin.site.register(StudentGroup)
admin.site.register(StudentGroupUser)
