# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-20 20:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('murr', '0003_cat_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cat',
            name='slug',
            field=models.SlugField(blank=True),
        ),
    ]
