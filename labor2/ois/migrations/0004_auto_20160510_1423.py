# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-10 11:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ois', '0003_auto_20160510_1336'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='code',
            field=models.CharField(max_length=20),
        ),
    ]