# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-10 10:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ois', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='semester',
            name='number',
        ),
        migrations.AddField(
            model_name='semester',
            name='name',
            field=models.CharField(default='Spring 2015/2016', max_length=15),
            preserve_default=False,
        ),
    ]
