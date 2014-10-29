from django.db import models

class Request(models.Model):
	start_time = models.DateTimeField()
	end_time = models.DateTimeField()
	status = models.SmallIntegerField()
	detail = models.CharField(max_length=100)

class Request_host(models.Model):
	ip = models.IPAddressField()
	username = models.CharField(max_length=30)
	password = models.CharField(max_length=30)
	start_time = models.DateTimeField()
	end_time = models.DateTimeField()
	status = models.SmallIntegerField()
	detail = models.CharField(max_length=100)
	request = models.ForeignKey(Request)

class Info(models.Model):
	record_id = models.CharField(max_length=10)
	record_type = models.CharField(max_length=10)
	timestamp = models.CharField(max_length=50)
	generator_id = models.CharField(max_length=10)
	event_revision = models.CharField(max_length=10)
	sensor_type = models.CharField(max_length=50)
	sensor_num = models.CharField(max_length=10)
	event_type= models.CharField(max_length=100)
	event_dir = models.CharField(max_length=50)
	event_data = models.CharField(max_length=30)
	event_descrip = models.CharField(max_length=100)
	request = models.ForeignKey(Request)
