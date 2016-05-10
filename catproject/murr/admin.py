from django.contrib import admin

# Register your models here.
from .models import Cat
from .models import Color

class ColorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

class CatAdmin(admin.ModelAdmin):
    list_display = ('name', 'birth_year', 'color', 'slug')

admin.site.register(Cat, CatAdmin)
admin.site.register(Color, ColorAdmin)