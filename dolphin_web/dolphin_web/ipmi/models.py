"""
    Data models used by Django to build up a valid database
    Author: YuanBao
    Email: wenkaiyuan123@gmail.com
"""

from django.db import models

class Request(models.Model):
    """
        Data model for Request table
    """
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.SmallIntegerField()
    detail = models.CharField(max_length=100)


class RequestHost(models.Model):
    """
        Data model for RequestHost table
    """
    ip_addr = models.IPAddressField()
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.SmallIntegerField()
    detail = models.CharField(max_length=100)
    request = models.ForeignKey(Request)


class Info(models.Model):
    """
        Data model for IpmiInfo table
    """
    sel_id = models.IntegerField()
    sel_type = models.SmallIntegerField()
    level = models.CharField(max_length=30)
    desc = models.CharField(max_length=40)
    info = models.CharField(max_length=400)
    request = models.ForeignKey(Request)
    host = models.ForeignKey(RequestHost)
