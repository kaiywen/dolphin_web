"""
    Url configurations for Project Dolphin
"""

from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.staticfiles import views 

urlpatterns = patterns('dolphin_web.views',
    url(r'^$', 'login_view'),
    url(r'^index.html/', 'index_view'),
    url(r'^login.html/$', 'validate_view'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout.html/$', 'logout_view'),
    url(r'^history.html/', 'history_view'),
    url(r'^sel_query.html/$', 'sel_query_view'),
    url(r'^callback.html/', 'dolphind_cb_view'),
    url(r'^export_csv.html/$', 'export_csv_view'),
    url(r'^reload_history.html/$', 'reload_history_view'),
    url(r'^cmd_detail.html/$', 'cmd_detail_view'),
    url(r'^export_csv2.html/$', 'export_csv2_view')
)

