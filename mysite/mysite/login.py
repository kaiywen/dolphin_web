from django.http import HttpResponse
from django.http import Http404
from django.http import HttpResponseRedirect
from django.template.loader import get_template
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth

def login_view(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('/index.html')
	else:
		return render_to_response('login.html')


def index(request):
	if request.user.is_authenticated():
	    return render_to_response('index.html')
	else:
		return HttpResponseRedirect('/') 

@csrf_exempt
def check_user(request):
	if request.method != 'POST':
	    return Http404('Only POSTs are allowed')
	if "username" in request.POST:
		username = request.POST['username']
	else:
		username = ""

	if "password" in request.POST:
		password = request.POST["password"]
	else:
		password = ""

	admin_user = auth.authenticate(username=username, password=password)
	if admin_user is not None and admin_user.is_active:
		auth.login(request, admin_user)
		return HttpResponse("index.html")
	else:
		return HttpResponse("error")

def logout_view(request):
	auth.logout(request)
	return HttpResponseRedirect('/')


def history_view(request):
	if request.user.is_authenticated():
		return render_to_response('history.html')
	else:
		return HttpResponseRedirect('/')