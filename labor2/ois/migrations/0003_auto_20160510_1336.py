# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-10 10:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ois', '0002_auto_20160510_1335'),
    ]

    operations = [
        migrations.AlterField(
            model_name='semester',
            name='name',
            field=models.CharField(max_length=16),
        ),
    ]
