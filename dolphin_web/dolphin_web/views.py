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
import const

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
        ipmi_entry_list = Info.objects.all() 
        return render_to_response('index.html', {'ipmi_entry_list': ipmi_entry_list})
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
        return render_to_response('history.html')
    else:
        return HttpResponseRedirect('/')


request_status = dict()

@csrf_exempt
def single_cmd_view(request):
    """
        TODO (Kaiyuan)
    """
    username, password, ip = (
        request.POST["username"], 
        request.POST["password"],
        request.POST["ip_addr"]
    )

    ### TODO (Kaiyuan) 
    ### Exception handler for empty parameters
    
    request = Request(start_time=timezone.now(), detail='')
    request.save()
    
    request_host = RequestHost(
        ip_addr=ip, username=username, 
        password=password, 
        start_time=timezone.now(), 
        request_id=request.id, 
        detail='' )

    request_host.save()

    server_addr = "http://%s:%s" % (REMOTE_SERVER_IP, REMOTE_SERVER_PORT)
    dolphind_cb_url = "http://%s:%s/callback.html/" % (LOCAL_IP, LOCAL_PORT)
    
    dolphind = ServerProxy(server_addr)
    dolphind.request(request.id, dolphind_cb_url)


def dolphind_cb_view(request):
    request_id, status = (request.GET["id"], request.GET["status"])
    request_status[request_id] = status