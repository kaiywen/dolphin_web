"""
    Url configurations for Project Dolphin
"""

from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.staticfiles import views 

urlpatterns = patterns('dolphin_web.views',
    url(r'^$', 'login_view'),
    url(r'^index.html/$', 'index_view'),
    url(r'^login.html/$', 'validate_view'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout.html/$', 'logout_view'),
    url(r'^history.html/$', 'history_view'),
    url(r'^single_cmd.html/$', 'single_cmd_view'),
    url(r'^callback.html/$', 'dolphind_cb_view')
)

