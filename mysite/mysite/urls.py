from django.conf.urls import patterns, include, url
from django.contrib import admin
# from mysite.login import login_view, index, check_user, logout_view
from django.contrib.staticfiles import views

urlpatterns = patterns('mysite.login',
    # Examples:
    url(r'^$', 'login_view'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^index\.html/$', 'index'),
    url(r'^login\.html/$', 'check_user'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout\.html/$', 'logout_view'),
    url(r'^history\.html/$', 'history_view'),
)
