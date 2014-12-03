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
    end_time = models.DateTimeField(null=True)
    status = models.SmallIntegerField(null=True)
    detail = models.CharField(max_length=100)


class RequestHost(models.Model):
    """
        Data model for RequestHost table
    """
    ip_addr = models.IPAddressField()
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True)
    status = models.SmallIntegerField(null=True)
    detail = models.CharField(max_length=100)
    request = models.ForeignKey(Request)

    def __str__(self):
        return "%s %s" % (self.ip_addr, self.username)

    class Meta:
        ordering = ["username"]


class Info(models.Model):
    """
        Data model for IpmiInfo table
    """
    sel_id = models.IntegerField()
    sel_type = models.SmallIntegerField()
    sel_timestamp = models.DateTimeField(null=True)
    sel_severity = models.CharField(max_length=30)
    sel_level = models.CharField(max_length=20)
    sel_desc = models.CharField(max_length=40)
    sel_info = models.CharField(max_length=800)
    request = models.ForeignKey(Request)
    host = models.ForeignKey(RequestHost)
    
    class Meta:
        ordering = ["sel_type"]
