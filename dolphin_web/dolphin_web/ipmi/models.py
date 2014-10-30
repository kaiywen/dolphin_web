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
    record_id = models.CharField(max_length=10)
    record_type = models.CharField(max_length=10) #TAG
    timestamp = models.CharField(max_length=50) #TAG
    generator_id = models.CharField(max_length=10)
    event_revision = models.CharField(max_length=10) #TAG
    sensor_type = models.CharField(max_length=50)
    sensor_num = models.CharField(max_length=10)
    event_type = models.CharField(max_length=100)
    event_dir = models.CharField(max_length=50)
    event_data = models.CharField(max_length=30) #TAG
    event_descrip = models.CharField(max_length=100) #TAG
    sel_entry = models.CharField(max_length=30)
    request = models.ForeignKey(Request)
