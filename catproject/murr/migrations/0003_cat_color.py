# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-20 19:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('murr', '0002_auto_20160420_1829'),
    ]

    operations = [
        migrations.AddField(
            model_name='cat',
            name='color',
            field=models.ForeignKey(default='wht', on_delete=django.db.models.deletion.CASCADE, to='murr.Color'),
        ),
    ]
