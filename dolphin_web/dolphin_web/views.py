"""
    View functions for dolphin project
    Author: YuanBao
    Email: wenkaiyuan123@gmail.com
"""

from django.http import HttpResponse
from django.http import Http404
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from ipmi.models import Request, RequestHost, Info
from django.utils import timezone
from xmlrpclib import ServerProxy
from settings import REMOTE_SERVER_IP, REMOTE_SERVER_PORT, LOCAL_IP, LOCAL_PORT
from django.template import loader, Context
from const import *
import csv,json
import posix_ipc

def login_view(request):
    """
        Handle business logic initially
        Corresponding URL : (ip:port/)
    """
    if request.user.is_authenticated(): 
        return HttpResponseRedirect('/index.html')
    else:
        return render_to_response('login.html')

def index_view(request):
    """
        Return index page for valid users
            and return default page for invalid visitors
        Corresponding URL : (ip:port/index.html)
    """
    if request.user.is_authenticated():
        return render_to_response('index.html')
    else:
        return HttpResponseRedirect('/')

@csrf_exempt
def validate_view(request):
    """
        Check wthether the visitor is valid
        Corresponding URL : (ip:port/login.html)
    """
    if request.method != 'POST':
        return Http404('Only POSTs are allowed')
    if "username" in request.POST:
        username = request.POST["username"]
    else:
        username = ""

    if "password" in request.POST:
        password = request.POST["password"]
    else:
        password = ""

    admin_user = auth.authenticate(username=username, password=password)
    if admin_user is not None and admin_user.is_active:
        auth.login(request, admin_user)
        return HttpResponse("/index.html")
    else:
        return HttpResponse("error")

def logout_view(request):
    """
        Log out the visitor
        Corresponding URL : (ip:port/logout.html)
    """
    auth.logout(request)
    return HttpResponseRedirect('/')


def history_view(request):
    """
        Return the page of history CMDs for users
        Corresponding URL : (ip:port/history.html)
    """
    if request.user.is_authenticated():
        cmd_his_list = Request.objects.all()
        return render_to_response('history.html', {'cmd_his_list': cmd_his_list})
    else:
        return HttpResponseRedirect('/')


@csrf_exempt
def sel_query_view(request):

    """
        Return the sel list
        Corresponding URL : (ip:port/sel_query.html)
    """
    if request.user.is_authenticated():
        request_type = int(request.POST["request_type"])
        """
            The client polls for data for three times totally
            The first two times ask for status
            The last query asks for the final sel list
        """
        if request_type == REQ_FOR_STATUS:
            sel_request = Request(start_time=timezone.now(), status=INITIAL, detail='')
            sel_request.save()
            request_id = str(sel_request.id)
            request.session["rid"] = request_id

            request_class = int(request.POST["request_class"])  ##single-cmd or multi-cmd
            
            if request_class == SINGLE:  ##for a single command
                username, password, ip = (
                    request.POST["username"], 
                    request.POST["password"],
                    request.POST["ip_addr"]
                )
                sel_host = RequestHost(
                    ip_addr=ip, username=username, 
                    password=password, start_time=timezone.now(), 
                    request_id=sel_request.id, status=INITIAL, detail='')
                sel_host.save()
            
            elif request_class == MULTIPLE:  ##for multiple commands
                cmd_string = request.POST["cmd_list"]
                cmd_list = json.loads(cmd_string)
                for cmd in cmd_list:
                    sel_host = RequestHost(
                        ip_addr=cmd["ip_addr"], username=cmd["username"], 
                        password=cmd["password"], start_time=timezone.now(), 
                        request_id=sel_request.id, status=INITIAL, detail='')
                    sel_host.save()

            server_addr = "http://%s:%s" % (REMOTE_SERVER_IP, REMOTE_SERVER_PORT)
            dolphind_cb_url = "http://%s:%s/callback.html/" % (LOCAL_IP, LOCAL_PORT)

            semaph = posix_ipc.Semaphore(name="/%s" % request_id, flags = posix_ipc.O_CREAT, initial_value = 0)
            
            dolphind = ServerProxy(server_addr)
            dolphind.request(sel_request.id, dolphind_cb_url)
            semaph.acquire()
            return HttpResponse(RUNNING)

        elif request_type == REQ_FOR_SECOND_STATUS:
            request_id = str(request.session["rid"])
            semaph = posix_ipc.Semaphore(name="/%s" % request_id, flags = 0)
            semaph.acquire()
            semaph.unlink()
            detail = Request.objects.get(id=request_id).detail

            """
                It should be reminded that detail[0] indicates the successful number of hosts
                in a query. so (detail[0] == 0) means all the queries in a request fail. 
            """
            if int(detail[0]):
                return HttpResponse(FINISHED)
            else:
                return HttpResponse(FAILED)

        elif request_type == REQ_FOR_CONTENT:
            request_id = str(request.session["rid"])
            ipmi_entry_list = Info.objects.filter(request_id=request_id)
            return render_to_response('index_table.html', {'ipmi_entry_list': ipmi_entry_list})
    else:
        return HttpResponseRedirect('/')

@csrf_exempt
def dolphind_cb_view(request):
    request_id = str(request.GET["request_id"])
    semaph = posix_ipc.Semaphore(name="/%s" % request_id, flags = 0)
    semaph.release()


def export_csv_view(request):
    if request.user.is_authenticated():
        request_id = request.session["rid"]
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="sel_list.csv"'

        writer = csv.writer(response)

        ipmi_entry_list = Info.objects.filter(request_id=request_id)
        for entry in ipmi_entry_list:
            print entry.sel_info
            details = json.loads(entry.sel_info)
            row = [ details[key] for key in details ]
            writer.writerow(row)
        return response
    else:
        return HttpResponseRedirect('/')



@csrf_exempt
def reload_history_view(request):
    if request.user.is_authenticated():
        cmd_his_list = Request.objects.all()
        return render_to_response('hist_table.html', {'cmd_his_list': cmd_his_list})
    else:
        return HttpResponseRedirect('/')



@csrf_exempt
def cmd_detail_view(request):
    if request.user.is_authenticated():
        if "rid" in request.GET:
            request_id = request.GET["rid"]
            request.session["history_rid"] = request_id
            request_host_list = RequestHost.objects.filter(request_id=request_id)
            ipmi_entry_list = Info.objects.filter(request_id=request_id)
            return render_to_response('hist_details.html', {'request_host_list': request_host_list,
                'cmd_id' : request_id, 'ipmi_entry_list': ipmi_entry_list})
    else:
        return HttpResponseRedirect('/')



def export_csv2_view(request):
    if request.user.is_authenticated():
        if "history_rid" in request.session:
            request_id = request.session["history_rid"]
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="sel_list.csv"'

            writer = csv.writer(response)

            ipmi_entry_list = Info.objects.filter(request_id=request_id)
            for entry in ipmi_entry_list:
                print entry.sel_info
                details = json.loads(entry.sel_info)
                row = [ details[key] for key in details ]
                writer.writerow(row)
            return response
    else:
        return HttpResponseRedirect('/')